var redis=require("redis"),db=redis.createClient();function Entry(r){for(var n in r)this[n]=r[n]}(module.exports=Entry).prototype.save=function(n){var r=JSON.stringify(this);db.lpush("entries",r,function(r){return r?n(r):void n()})},Entry.getRange=function(r,n,t){db.lrange("entries",r,n,(r,n)=>{if(r)return t(r);var e=[];n.forEach(r=>{e.push(JSON.parse(r))}),t(null,e)})},Entry.count=function(r){db.llen("entries",r)};