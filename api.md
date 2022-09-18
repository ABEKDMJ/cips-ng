APIs in CIPS
=================

remote(HTTP)
-----------------

### General

#### User
1. `getUserState(loc<String>)`
- http:"GET","UserState.php",true
2. `getUserInfo()`
- http:"POST","UserInfo.php",true
3. `login()`
- http:"POST","Login.php",true
4. `logout()`
- http:"POST","Logout.php",true

### MControl

#### Mission
1. `getMissionObj(para<bool>)`
- http:"POST","MControlShow.php",true
2. `sendNew(newobj<Object>,loc<String>,callbackFunc<function>,sendpara<bool>)`
- http:"POST",loc,true
- http-type:json
3. `getRecycleList()`
- http:"GET","GetRecycleList.php",true

local
-----------------