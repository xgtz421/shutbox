var express=require("express");const basicAuth=require("express-basic-auth");var User=require("../lib/user"),Entry=require("../lib/entry");exports.auth=(s,e,t)=>{var r=(s.headers.authorization||"").split(/\s+/).pop()||"",i=Buffer.from(r,"base64").toString().split(/:/),r=i.shift(),i=i.join(":");basicAuth({authorizer:User.authenticate(r,i,(e,r)=>e?t(e):(s.remoteUser=r,void t()))})},exports.user=(e,s,t)=>{User.get(e.params.id,(e,r)=>e?t(e):r.id?void s.json(r):s.send(404))},exports.entries=(e,s,t)=>{e=e.page;Entry.getRange(e.from,e.to,(e,r)=>e?t(e):void s.json(r))};