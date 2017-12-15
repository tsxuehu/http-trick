const util = require('util');
const vm = require('vm');

global.globalVar = 3;

const sandbox = { globalVar: 1 ,channel: {}};
vm.createContext(sandbox);
try{
    vm.runInContext('globalVar *= 2;channel.a =!s2', sandbox);

}catch (e){
    console.log(e.message)
}


console.log(util.inspect(sandbox)); // { globalVar: 2 }

console.log(util.inspect(globalVar)); // 3