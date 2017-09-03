(function(root, factory){
	if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
	   module.exports = factory();
	} else {
	   root.enode = root.enode || {};
	   root.enode.SemParser = factory();
	}
}(this,
function(){
	'use strict';

	function Token(terminal,match){
		this.terminalId = terminal.id;
		this.text = match[0];
		var pro = {}, label = terminal.label;
		if( typeof(label) === 'string' ){
			pro = parserStr(label,match);
		}else{
			pro = this.text;
		}
		this.property = pro;
	}
	
	function Production(NT){
		this.id = NT.id;
		this.symbols = [].concat(NT.symbols);
		this.label = NT.label;
	}
	
	function Lexicon(terminals){
		this.terminals = [].concat( terminals );
	}
	Lexicon.prototype.lexical = function(sen){
		var TERMINAL = this.terminals,
			ERROR = null,re = {};
		var	paths = _extendPath([],sen,0);
		if( paths.length === 0 ){
			re.error = ERROR;
		}
		re.tokens = paths[0];
		re.paths = '';
		paths.forEach(function(path){
			re.paths += path.map(function(e){return e.text+'<'+e.terminalId+'>'}).join(' | ') + '\n';
		})
		
		return re;
		function _extendPath(path,str,pos){
			var re = [], sen = str.slice(pos);
			if( !sen ) return [path];
			var terminal, matched = false, i = 0, minMacthIndex = sen.length;
			while( terminal = TERMINAL[i++] ){
				var reg = RegExp(terminal.reg),
					match = sen.match(reg);
				if( !match ) continue;
				if( match.index > 0 && match.index < minMacthIndex ){
					minMacthIndex = match.index;
					continue;
				}
				if( match.index == 0 ){
					var tok = new Token(terminal,match),
						nPath = [].concat(path,tok);
					re = re.concat( _extendPath(nPath,str,pos+match[0].length) );
					matched = true;
				}
			}
			if( !matched ){
				var tok = sen.slice(0,minMacthIndex),msg='';
				msg += '[词法分析错误]\n';
				msg += '未识别的字符:"' + tok + '"\n';
				msg += str.replace(tok,'^'+tok+'^');
				ERROR = new Error(msg);
			}
			return re;
		}
	}
	
	function SyntaxNode(data){
		this.reset(data);
	}
	SyntaxNode.prototype.reset = function(that){
		this.data = that;
		if( that instanceof Production ){
			this.children = [];
		}
	}
	SyntaxNode.prototype.append = function(that){
		this.children.push(that);
	}	
	SyntaxNode.build = function(tokens,nonTerminalSet,start){
		var syn = new SyntaxNode();
		syntaxAnalysis(syn,start,tokens,0);
		return syn;	
		function syntaxAnalysis(syntax,nonTerminalId,tokens,pos){
			var pdcts = nonTerminalSet[nonTerminalId], pdct, a = 0;
			if( !pdcts )
				throw new Error('There are no NonTerminal:' + nonTerminalId);
			while( pdct = pdcts[a++] ){
				syntax.reset(pdct);
				var symbols = pdct.symbols, symbol, b = 0, cpos = pos, success = true;
				while( symbol = symbols[b++] ){
					if( symbol.charAt(0).toUpperCase() === symbol.charAt(0) ){
						var syn = new SyntaxNode(),
							n = syntaxAnalysis( syn, symbol, tokens, cpos );
						if( n > 0 ){
							cpos = n;
							syntax.append( syn );
							continue;
						}
					}else if( cpos < tokens.length ){
						var tok = tokens[cpos];
						if( tok.terminalId === symbol ){
							var syn = new SyntaxNode( tok );
							syntax.append( syn );
							cpos++;
							continue;
						}
					}
					cpos = pos;
					success = false;
					break;
				}
				if( success ){
					return cpos;
				}
			}
			return -1;
		}
	}
	SyntaxNode.prototype.harvest = function(){
		var label = this.data.label;
		if( this.data instanceof Token){
			return this.data.property;
		}else if( typeof(label)==='string' ){
			var args = [],lst = this.children, ci, i = 0;
			while( ci = lst[i++] ){
				args.push(ci.harvest());
			}
			return parserStr(label,args);
		}else if(this.children.length>0){
			var lst = this.children, ci, i = 0, pro = {};
			while( ci = lst[i++] ){
				var vci = ci.harvest();
				if( typeof(vci) === 'object' ){
					pro = extend(pro, vci);
				}
			}
			return pro;
		}else{
			return {};
		}
	}
	
	function Parser( terminals, productions, start){
		var nonTerminalSet = {length:0}, nti, i=0;
		while( nti = productions[i++] ){
			var id = nti.id;
			if( nonTerminalSet[id] === undefined ){
				nonTerminalSet[id] = [];
				nonTerminalSet.length++;
			}
			nonTerminalSet[id].push(new Production(nti));
		}
		
		this.nonTerminalSet = nonTerminalSet;
		this.enterNonTerminal = start;
		this.lex = new Lexicon( terminals );
		
		console.log('Terminal count:',terminals.length,' Nonterminal count:',nonTerminalSet.length,' Production count',productions.length);
	}
	Parser.prototype.feed = function(sen){
		sen = sen.replace(/[\s\n\r\t]/g,'');
		var re = {};
		var lexical = this.lex.lexical(sen);
		if( lexical.error ){
			re.lexical = '';
			re.content = lexical.error.message;
		}else{
			var tokens = lexical.tokens;
			var syn = SyntaxNode.build(tokens, this.nonTerminalSet, this.enterNonTerminal);
			console.log(tokens);
			console.log(syn);
			
			re.lexical = lexical.paths;
			re.syntax = syn;
			re.content = JSON.stringify(syn.harvest(),null,4);
		}

		return re;
	}

	return Parser;
	
	
	function parserStr(str,args){
		var code = 'return ' + str.replace(/\$(\d+)/g,'_$[$1]'),
			fun = new Function('$','_$',code);
		return fun.call(null, extend, args);
	}
	function extend(){
		var o = {};
		for(var n=0; n<arguments.length;n++){
			var on = arguments[n];
			if( typeof(on) !== 'object' ) continue;
			for(var p in on){
				var op = o[p],onp = on[p];
				if(op){
					if( op instanceof Array ){
						o[p] = [].concat(op,onp);
					}else if( typeof(op) === 'object' ){
						o[p] = extend(op,onp);
					}else{
						o[p] = onp;
					}
				}else{
					o[p] = onp;
				}
			}
		}
		return o;
	}

}));



