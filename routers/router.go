package routers

import (
	"cips-ng/controllers"

	"github.com/astaxie/beego"
)

func init() {
	beego.Router("/views", &controllers.MainController{})
	beego.Router("/user/getUserState", &controllers.GetUserStateCtrl{})
	beego.Router("/user/getUserInfo", &controllers.GetUserInfoCtrl{})
	beego.Router("/user/login", &controllers.LoginCtrl{})
	beego.Router("/user/logout", &controllers.LogoutCtrl{})
	beego.Router("/user/register", &controllers.RegisterCtrl{})
	beego.Router("/mcontrol/showMission", &controllers.McAddMissionCtrl{})
	beego.Router("/mcontrol/showMission", &controllers.McGetMissionCtrl{})
	beego.Router("/mcontrol/getRecycleList", &controllers.McReLiCtrl{})

}
