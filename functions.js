const decoded = {
  'lt': '<',
  'gt': '>',
  'amp': '&',
  'quot': '"',
  'apos': "'",
  '#39': "'",
  '#x2f': '\/',
};

const ESCAPED_HTML_REGEX = new RegExp(`&(${Object.keys(decoded).join('|')});`, 'ig');
module.exports={
	unescapeHTML(input){return input.replace(ESCAPED_HTML_REGEX, (m, p1) => decoded[p1] || m)},
	convertTime(timestamp){let hours=Math.floor(timestamp/60/60),minutes=Math.floor(timestamp/60)-(hours*60),seconds=timestamp%60;if(hours<10&&hours>0){hours=`0${hours}`}if(minutes<10&&minutes>0){minutes=`0${minutes}`}if(seconds<10&&seconds>0){seconds=`0${seconds}`}return{hours:hours,minutes:minutes,seconds:seconds}}
}