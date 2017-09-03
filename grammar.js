
(function(){
const grammar = {
	start: 'Main',
	nonTerminals: [
	{
		id: 'Main',
		symbols: ['Directive','Parentheses']
	},{
		id: 'Directive',
		symbols: ['voltage','stationName','Directive'],
		label: '$({dev:{station:$1}},$2)'
	},{
		id: 'Directive',
		symbols: ['stationName','Directive'],
		label: '$({dev:{station:$0}},$1)'
	},{
		id: 'Directive',
		symbols: ['Dev','Operation']
	},{
		id: 'Directive',
		symbols: ['prepTake','Dev','Operation']
	},{
		id: 'Dev',
		symbols: ['voltage','Dev'],
		label: '$({dev:{voltage:$0}},$1)'
	},{
		id: 'Dev',
		symbols: ['Breaker'],
		label: '$($0,{dev:{devType:"开关"}})'
	},{
		id: 'Dev',
		symbols: ['Transformer'],
		label: '$($0,{dev:{devType:"主变"}})'
	},{
		id: 'Dev',
		symbols: ['Load']
	},{
		id: 'Dev',
		symbols: ['Busbar','vt'],
		label: '{dev:{devName:$0.dev.devName+$1,devType:"PT"}}'
	},{
		id: 'Dev',
		symbols: ['Busbar'],
		label: '$($0,{dev:{devType:"母线"}})'
	},
	
	// 开关	
	{
		id: 'Breaker',
		symbols: ['devRole','DevCode','breaker','unit'],
		label: '$({dev:$($0,$1,$2)},{opt:{relation:$3}})'
	},{
		id: 'Breaker',
		symbols: ['devRole','DevCode','breaker'],
		label: '{dev:$($1,{devRole:$0})}'
	},{
		id: 'Breaker',
		symbols: ['DevCode','breaker'],
		label: '{dev:$($0,$1)}'
	},{
		// 主变开关
		id: 'Breaker',
		symbols: ['Transformer','Side','DevCode','breaker'],
		label: '{dev:$($1,$2,{owner:$0.dev.devName})}'
	},{
		// 负载开关及负载
		id: 'Breaker',
		symbols: ['Load','DevCode','breaker','conjAnd','LoadType'],
		label: '$({dev:$($($1,$2),{owner:$0.dev.devName})},{opt:{relation:$0.dev.devType}})'
	},{
		// 负载开关
		id: 'Breaker',
		symbols: ['Load','DevCode','breaker'],
		label: '{dev:$($($1,$2),{owner:$0.dev.devName})}'
	},
	
	// 主变
	{
		// 主变及110kV侧110开关
		id: 'Transformer',
		symbols: ['TransformerName','conjAnd','Side','DevCode','breaker'],
		label: '{dev:$($0,{relation:$2.side},{breakerCode:$3.devCode})}'
	},{
		// 主变及各侧开关
		id: 'Transformer',
		symbols: ['TransformerName','conjAnd','Side','breaker'],
		label: '{dev:$($0,{relation:$2.side})}'
	},{
		id: 'Transformer',
		symbols: ['TransformerName'],
		label: '{dev:$0}'
	},{
		id: 'TransformerName',
		symbols: ['GroupNum','transformer'],
		label: '{devName:$0.group+$1}'
	},{
		id: 'TransformerName',
		symbols: ['transformer','GroupNum'],
		label: '{devName:$0+$1.group}'
	},
	
	// 母线
	{
		// 母线及PT
		id: 'Busbar',
		symbols: ['BusbarName','conjAnd','vt'],
		label: '{dev:$($0,{relation:$2})}'
	},{
		// 母线负荷
		id: 'Busbar',
		symbols: ['BusbarName','load'],
		label: '{dev:$($0,{relation:$1})}'
	},{
		id: 'Busbar',
		symbols: ['BusbarName'],
		label: '{dev:$0}'
	},{
		id: 'BusbarName',
		symbols: ['voltage','BusbarName'],
		label: '$({voltage:$0},$1)'
	},{
		id: 'BusbarName',
		symbols: ['romanNumerals','numSegment','busbar'],
		label: '{devName:$0+$1+$2}'
	},{
		id: 'BusbarName',
		symbols: ['romanNumerals','busbar'],
		label: '{devName:$0+$1}'
	},{
		id: 'BusbarName',
		symbols: ['busbar'],
		label: '{devName:$0}'
	},
	
	// 线路、电容器、电抗器、消弧线圈、所变
	{
		// ××线100线路及100开关
		id: 'Load',
		symbols: ['LoadName','DevCode','LoadType','conjAnd','DevCode','breaker'],
		label: '{dev:$($0,{relation:$5,breakerCode:$4.devCode})}'
	},{
		// ××线100线路及开关
		id: 'Load',
		symbols: ['LoadName','DevCode','LoadType','conjAnd','breaker'],
		label: '{dev:$($0,{relation:$4,breakerCode:$1.devCode})}'
	},{
		// ××线线路及100开关
		id: 'Load',
		symbols: ['LoadName','LoadType','conjAnd','DevCode','breaker'],
		label: '{dev:$($0,{relation:$4,breakerCode:$3.devCode})}'
	},{
		// ××线100线路
		id: 'Load',
		symbols: ['LoadName','DevCode','LoadType'],
		label: '{dev:$($0,{breakerCode:$1.devCode})}'
	},{
		id: 'Load',
		symbols: ['LoadName'],
		label: '{dev:$0}'
	},{
		id: 'LoadType',
		symbols: ['noumenon']
	},{
		id: 'LoadType',
		symbols: ['line']
	},{
		id: 'LoadType',
		symbols: ['stationTransformer'],
		label: '{reality:$0,devType:"所变"}'
	},{
		id: 'LoadType',
		symbols: ['capacitor'],
		label: '{reality:$0,devType:"电容器"}'
	},{
		id: 'LoadType',
		symbols: ['reator'],
		label: '{reality:$0,devType:"电抗器"}'
	},{
		id: 'LoadType',
		symbols: ['arcSuppressionCoil'],
		label: '{reality:$0,devType:"消弧线圈"}'
	},{
		id: 'LoadName',
		symbols: ['lineName'],
		label: '{devName:$0,devType:"线路"}'
	},{
		id: 'LoadName',
		symbols: ['GroupNum','LoadType'],
		label: '{devName:$0.group+$1.reality,devType:$1.devType}'
	},{
		id: 'LoadName',
		symbols: ['LoadType','GroupNum'],
		label: '{devName:$0.reality+$1.group,devType:$0.devType}'
	},
	
	// 设备编号
	{
		id: 'DevCode',
		symbols: ['devCode','divider','DevCode'],
		label: '$({devCode:[$0]},$2)'
	},{
		id: 'DevCode',
		symbols: ['devCode'],
		label: '{devCode:$0}'
	},
	
	// 主变、所变、电容器、电抗器、消弧线圈的编号、组号
	{
		id: 'GroupNum',
		symbols: ['n#'],
		label: '{group:$0}'
	},{
		id: 'GroupNum',
		symbols: ['romanNumerals','numGroup'],
		label: '{group:$0+$1}'
	},{
		id: 'GroupNum',
		symbols: ['numGroup','romanNumerals'],
		label: '{group:$0+$1}'
	},{
		id: 'GroupNum',
		symbols: ['chineseNumerals','numGroup'],
		label: '{group:$0+$1}'
	},
	
	// 操作
	{
		id: 'Operation',
		symbols: ['prepFrom','Operation'],
		label: '$1'
	},{
		// 经开关转运行
		id: 'Operation',
		symbols: ['State','StateChange','prepThrough','Breaker','State'],
		label: '{opt:{optName:$0.state+$1.action+$4.state,through:$3.dev.devCode,optMode:$4.optMode,srcState:$0.state,srcStateMode:$0.optMode,destState:$4.state}}'
	},{
		// 从(当前母线)当前状态转(目的母线)目的状态
		id: 'Operation',
		symbols: ['ConnectedBusbar','State','StateChange','ConnectedBusbar','State'],
		label: '{opt:{optName:($0.devName&&$3.devName?"倒母线":$1.state+$2.action+$4.state),srcState:$1.state,srcOptMode:$1.optMode,srcBusbar:$0.devName,srcBusbarVoltage:$0.voltage,destState:$4.state,destOptMode:$4.optMode,destBusbar:$3.devName,destBusbarVoltage:$3.voltage}}'
	},{
		// 旁路母线切换被旁代线路
		id: 'Operation',
		symbols: ['ConnectedLine','State','StateChange','ConnectedLine','State'],
		label: '{opt:{optName:"旁代改接",srcLine:$0.devName,srcBreaker:$0.breakerCode,srcState:$1.state,destLine:$3.devName,destBreaker:$3.breakerCode,destState:$4.state}}'
	},{
		// 旁路开关切换被旁代开关
		id: 'Operation',
		symbols: ['DisplacedBreaker','State','StateChange','DisplacedBreaker','State'],
		label: '{opt:{optName:"旁代改接",srcLine:$0.lineName,srcBreaker:$0.devCode,srcState:$1.state,destLine:$3.lineName,destBreaker:$3.devCode,destState:$4.state}}'
	},{
		id: 'StateChange',
		symbols: ['VerbSwitch','prepTo']
	},{
		id: 'StateChange',
		symbols: ['VerbSwitch']
	},{
		id: 'VerbSwitch',
		symbols: ['verbShift'],
		label: '{action:"转"}'
	},{
		id: 'VerbSwitch',
		symbols: ['verbSwitch'],
		label: '{action:"切换"}'
	},{
		id: 'VerbSwitch',
		symbols: ['verbChange'],
		label: '{action:"改"}'
	},
	
	// 运行/热备/冷备/检修状态
	{
		id: 'State',
		symbols: ['operatingMode','State'],
		label: '$({optMode:$0},$1)'
	},{
		id: 'State',
		symbols: ['operational'],
		label: '{state:"运行"}'
	},{
		id: 'State',
		symbols: ['hotStandby'],
		label: '{state:"热备"}'
	},{
		id: 'State',
		symbols: ['codeStandby'],
		label: '{state:"冷备"}'
	},{
		id: 'State',
		symbols: ['maintenance'],
		label: '{state:"检修"}'
	},
	
	// 侧属性
	{
		id: 'Side',
		symbols: ['voltage','side'],
		label: '{side:$0+$1}'
	},{
		id: 'Side',
		symbols: ['transformerSide'],
		label: '{side:$0}'
	},{
		id: 'Side',
		symbols: ['sideRelation'],
		label: '{side:$0}'
	},
	
	// 附加参数
	{
		id: 'Parentheses',
		symbols: ['lParen','Parameter','rParen'],
		label: '$1'
	},{
		id: 'Parentheses',
		symbols: []
	},{
		id: 'Parameter',
		symbols: ['operatingMode'],
		label: '{opt:{optMode:$0}}'
	},{
		id: 'Parameter',
		symbols: ['MulParameter','divider','Parameter'],
		label: '$({opt:{additives:[$0]}},$2)'
	},{
		id: 'Parameter',
		symbols: ['MulParameter'],
		label: '{opt:{additives:[$0]}}'
	},{
		id: 'MulParameter',
		symbols: ['AdditiveBreaker','operatingMode'],
		label: '$($0,{optMode:$1})'
	},{
		id: 'MulParameter',
		symbols: ['AdditiveBreaker','StateChange','ConnectedBusbar','DestState'],
		label: '$($0,{destBusbar:$2.devName,destBusbarVoltage:$2.voltage},{destState:$3.state})'
	},{
		id: 'MulParameter',
		symbols: ['AdditiveBreaker','ConnectedBusbar','DestState'],
		label: '$($0,{destBusbar:$1.devName,destBusbarVoltage:$1.voltage},{destState:$2.state})'
	},{
		id: 'AdditiveBreaker',
		symbols: ['Breaker'],
		label: '{devCode:$0.dev.devCode}'
	},{
		id: 'AdditiveBreaker',
		symbols: ['devCode'],
		label: '{devCode:$0}'
	},{
		id: 'ConnectedBusbar',
		symbols: ['prepConnect','ConnectedBusbar'],
	},{
		id: 'ConnectedBusbar',
		symbols: ['prepTreat','ConnectedBusbar'],
	},{
		id: 'ConnectedBusbar',
		symbols: ['Busbar'],
		label: '$0.dev'
	},{
		id: 'ConnectedBusbar',
		symbols: []
	},{
		id: 'ConnectedLine',
		symbols: ['prepConnect','ConnectedLine'],
	},{
		id: 'ConnectedLine',
		symbols: ['Load'],
		label: '{devName:$0.dev.devName,breakerCode:$0.dev.breakerCode}'
	},{
		id: 'ConnectedLine',
		symbols: []
	},{
		id: 'DisplacedBreaker',
		symbols: ['prepDisplace','Breaker'],
		label: '{devCode:$1.dev.devCode,lineName:$1.dev.owner}'
	},{
		id: 'DestState',
		symbols: ['prepAt','State']
	},{
		id: 'DestState',
		symbols: ['State']
	},{
		id: 'DestState',
		symbols: []
	}

	]
}

if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
	module.exports = grammar;
} else {
	window.GM = window.GM || {};
	window.GM.nonTerminals = grammar.nonTerminals;
	window.GM.start = grammar.start;
}

}());