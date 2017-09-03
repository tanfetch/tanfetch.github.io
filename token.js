
(function(){
const grammar = {
	terminals: [
    {
        id: 'voltage',
        reg: '([0-9][.]?[0-9]{0,2})[kK千]?[vV伏]'
    },
    {
        id: 'breaker',
        reg: '开关|断路器'
    },
    {
        id: 'disconnector',
        reg: '刀闸|隔离开关|隔离刀闸'
    },
    {
        id: 'groundDisconnector',
        reg: '地刀|接地开关|接地刀闸'
    },
	{
        id: 'stationTransformer',
        reg: '(所|站)用?变'
    },
    {
        id: 'transformer',
        reg: '主变|联变'
    },
    {
        id: 'vt',
        reg: 'PT'
    },
    {
        id: 'ct',
        reg: 'CT'
    },
    {
        id: 'arcSuppressionCoil',
        reg: '消弧(装置|线圈)'
    },
    {
        id: 'capacitor',
        reg: '电容器组?'
    },
    {
        id: 'reator',
        reg: '电抗器组?'
    },
    {
        id: 'line',
        reg: '线路|出线(电缆)?'
    },
    {
        id: 'busbar',
        reg: '(旁(路)?)?母(线(?!路))?'
    },
    {
        id: 'devRole',
        reg: '旁路|母联|母分|分段|内桥'
    },
    {
        id: 'operational',
        reg: '运行(状态)?'
    },
    {
        id: 'hotStandby',
        reg: '热备(用)?(状态)?'
    },
    {
        id: 'codeStandby',
        reg: '冷备(用)?(状态)?'
    },
    {
        id: 'maintenance',
        reg: '检修(状态)?'
    },
    {
        id: 'operatingMode',
        reg: '充电|成串|合环|解环|同期|空载|旁代|正常方式'
    },
    {
        id: 'sideRelation',
        reg: '三侧|两侧|各侧'
    },
    {
        id: 'transformerSide',
        reg: '(高压|中压|低压)侧'
    },
    {
        id: 'noumenon',
        reg: '本体'
    },
    {
        id: 'unit',
        reg: '单元'
    },
    {
        id: 'side',
        reg: '侧'
    },
    {
        id: 'load',
        reg: '负荷|负载'
    },
    {
        id: 'threePhase',
        reg: '三相'
    },
    {
        id: 'aPhase',
        reg: '[Aa]相'
    },
    {
        id: 'bPhase',
        reg: '[Bb]相'
    },
    {
        id: 'cPhase',
        reg: '[Cc]相'
    },
    {
        id: 'verbOpen',
        reg: '拉开|断开'
    },
	{
        id: 'verbClose',
        reg: '合上'
    },
    {
        id: 'verbOn',
        reg: '投入'
    },
    {
        id: 'verbOff',
        reg: '退出|解除'
    },
    {
        id: 'verbShift',
        reg: '转|切换'
    },
	{
        id: 'verbSwitch',
        reg: '倒'
    },
    {
        id: 'verbChange',
        reg: '改'
    },
    {
        id: 'verbCheck',
        reg: '检?查'
    },
    {
        id: 'verbConfirm',
        reg: '确(已)?'
    },
    {
        id: 'prepTake',
        reg: '将|把'
    },
    {
        id: 'prepFrom',
        reg: '由|从'
    },
	{
        id: 'prepTo',
        reg: '至|到|为'
    },
    {
        id: 'prepConnect',
        reg: '接'
    },
    {
        id: 'prepTreat',
        reg: '对'
    },
    {
        id: 'prepDisplace',
        reg: '代'
    },
    {
        id: 'prepThrough',
        reg: '经'
    },
    {
        id: 'prepAt',
        reg: '在|处'
    },
    {
        id: 'numSegment',
        reg: '段'
    },
    {
        id: 'numGroup',
        reg: '组|号'
    },
    {
        id: 'conjAnd',
        reg: '及其?'
    },
    {
        id: 'divider',
        reg: '[,/]|，|、'
    },
    {
        id: 'lParen',
        reg: '[(]|（'
    },
    {
        id: 'rParen',
        reg: '[)]|）'
    },
    {
        id: 'n#',
        reg: '[0-9](#|＃|号)|(#|＃)[0-9]'
    },
	{
		id: 'romanNumerals',
		reg: '[ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ]'
	},
	{
		id: 'chineseNumerals',
		reg: '[一二三四五六七八九十]'
	},
    {
        id: 'lineName',
        reg: '.{2,4}?(线|回(线(?!路))?|路)'
    },
    {
        id: 'stationName',
        reg: '.{2,6}?(变|站)'
    },
    {
        id: 'devCode',
        reg: '[所]?[A-Za-z0-9-]{2,5}[甲乙丙丁东南]?[A-Za-z0-9-]{0,2}'
    }
	],
}

if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
	module.exports = grammar;
} else {
	window.GM = window.GM || {};
	window.GM.terminals = grammar.terminals;
}

}());