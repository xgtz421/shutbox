function parseFiele(e){return e}function getField(e,r){return e.body[r]}exports.required=function(n){return function(e,r,t){getField(e,n)?t():(r.error(n+" is required"),r.redirect("back"))}},exports.lengthAbove=function(n,i){return function(e,r,t){getField(e,n).length>i?(r.error(n+` must have more than ${i} characters`),r.redirect("back")):t()}};