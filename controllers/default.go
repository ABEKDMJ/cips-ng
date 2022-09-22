package controllers

import (
	"crypto/md5"
	"encoding/json"
	"fmt"
	"io"
	"log"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	_ "github.com/go-sql-driver/mysql"
)

// 定义Controllers结构体
type MainController struct {
	beego.Controller
}

type GetUserStateCtrl struct {
	beego.Controller
}

type GetUserInfoCtrl struct {
	beego.Controller
}

type LoginCtrl struct {
	beego.Controller
}

type LogoutCtrl struct {
	beego.Controller
}

type RegisterCtrl struct {
	beego.Controller
}

type ChangePwCtrl struct {
	beego.Controller
}

type McGetMissionCtrl struct {
	beego.Controller
}

type McAddMissionCtrl struct {
	beego.Controller
}

type McEditMissionCtrl struct {
	beego.Controller
}

type McDelMissionCtrl struct {
	beego.Controller
}

type McRecMissionCtrl struct {
	beego.Controller
}

type McClLiCtrl struct {
	beego.Controller
}

type McReLiCtrl struct {
	beego.Controller
}

// 定义数据结构体
type LoginJson struct {
	Un string `json:"username"`
	Pw string `json:"password"`
}

// 修改任务信息json
type EditMissionJson struct {
	Mid []int
	Til []string
	Des []string
	Lst []string
	Mod []int
	Sta []int
	Pid []int
	Pnu []int
	Stt []string
	Edt []string
}

// SQL用户查询对象
type User struct {
	Id int    `orm:"column(Id);pk"`
	Un string `orm:"column(username)"`
	Tb string `orm:"column(tablename)"`
}

// 用户信息修改对象
type UserChange struct {
	Id   int    `orm:"column(Id);pk"`
	Pw   string `orm:"column(username)"`
	CfPw string `orm:"column(tablename)"`
}

// SQL任务查询对象
type Mission struct {
	Mid int    `orm:"column(Id);pk"`
	Til string `orm:"column(title)"`
	Des string `orm:"column(describe)"`
	Lst string `orm:"column(lasttime)"`
	Mod int    `orm:"column(mode)"`
	Sta int    `orm:"column(status)"`
	Pid int    `orm:"column(paraid)"`
	Pnu int    `orm:"column(paranum)"`
	Stt string `orm:"column(starttime)"`
	Edt string `orm:"column(endtime)"`
}

// 数据库连接初始化
func init() {
	orm.RegisterDataBase("default", "mysql", "root:192837465@tcp(127.0.0.1:3306)/default?charset=utf8")
	// 需要在init中注册定义的model
	orm.RegisterModel(new(User))
}

// Controllers方法
func (c *MainController) Get() {
	//c.Header("Content-Type", "text/html; charset=utf-8")
	c.TplName = "index.html"
}

// 用户注册
func (c *RegisterCtrl) Post() {

}

// 添加任务
func (c *McAddMissionCtrl) Post() {
	admit := c.GetSession("admit")
	result := 0 // 未登录

	if admit == true {
		// json数据处理
		var missionJson Mission
		err1 := json.Unmarshal(c.Ctx.Input.RequestBody, &missionJson)
		if err1 != nil {
			log.Fatal(err1)
		}

		tbn := c.GetSession("tbn")
		// 构造查询
		var missionData Mission

		// 执行 SQL 语句
		o := orm.NewOrm()
		// 校验是否存在同名任务
		o.Raw("SELECT title FROM ? WHERE title= ?", tbn, missionJson.Til).QueryRow(&missionData)
		if missionData.Til == missionJson.Til {
			result = 1 // 存在同名任务
		} else {
			_, err2 := o.Insert(&missionJson)

			if err2 != nil {
				log.Fatal(err1)
				result = 2 // 数据库插入操作失败
			} else {
				result = 3 // 插入成功
			}
		}
	}
	// 返回数据
	c.Ctx.WriteString(fmt.Sprintf("%v", result))
}

// 获取任务
func (c *McGetMissionCtrl) Post() {
	admit := c.GetSession("admit")

	if admit == true {

		tbn := c.GetSession("tbn")
		// 构造查询
		var missionData []Mission

		// 执行 SQL 语句
		o := orm.NewOrm()
		o.Raw("SELECT * FROM ?", tbn).QueryRows(&missionData)

		c.Data["json"] = &missionData

		c.ServeJSON()
	}
}

// 修改任务信息
func (c *McEditMissionCtrl) Post() {
	result := 0 // 未登录
	admit := c.GetSession("admit")
	if admit == true {
		tbn := c.GetSession("tbn")
		// json数据处理
		var missionJson EditMissionJson
		err1 := json.Unmarshal(c.Ctx.Input.RequestBody, &missionJson)
		if err1 != nil {
			log.Fatal(err1)
		}

		// 构造查询
		var missionData Mission
		// 查询对应任务信息
		o := orm.NewOrm()
		o.Raw("SELECT * FROM ? WHERE Id = ?", tbn, missionJson.Mid[0]).QueryRow(&missionData)
		missionData.Til = missionJson.Til[0]
		missionData.Des = missionJson.Des[0]
		missionData.Lst = missionJson.Lst[0]
		missionData.Mod = missionJson.Mod[0]
		missionData.Sta = missionJson.Sta[0]
		missionData.Pid = missionJson.Pid[0]
		missionData.Pnu = missionJson.Pnu[0]
		missionData.Stt = missionJson.Stt[0]
		missionData.Edt = missionJson.Edt[0]
		_, err2 := o.Update(&missionData)

		if err2 != nil {
			log.Fatal(err2)
			result = 2 // 数据库更新操作失败
		}
		// 返回数据
		c.Ctx.WriteString(fmt.Sprintf("%v", result))
	}
}

// 移动任务至回收箱
func (c *McDelMissionCtrl) Post() {
	result := 0 // 未登录
	admit := c.GetSession("admit")
	if admit == true {
		tbn := c.GetSession("tbn")
		// 构造查询
		var missionData []Mission

		// 执行 SQL 语句
		o := orm.NewOrm()
		o.Raw("SELECT * FROM ? WHERE status = 5", tbn).QueryRow(&missionData)

		// 返回数据
		c.Ctx.WriteString(fmt.Sprintf("%v", result))
	}
}

// 获取回收箱任务
func (c *McReLiCtrl) Get() {
	admit := c.GetSession("admit")

	if admit == true {
		// json数据处理
		var loginJson LoginJson
		err1 := json.Unmarshal(c.Ctx.Input.RequestBody, &loginJson)
		if err1 != nil {
			log.Fatal(err1)
		}

		tbn := c.GetSession("tbn")
		// 构造查询
		var missionData []Mission

		// 执行 SQL 语句
		o := orm.NewOrm()
		o.Raw("SELECT * FROM ?", tbn).QueryRows(&missionData)

		c.Data["json"] = &missionData

		c.ServeJSON()
	}
}

// 处理获取用户状态请求
func (c *GetUserStateCtrl) Get() {
	var result int
	admit := c.GetSession("admit")
	if admit == true {
		result = 1 // 已登录
	} else {
		result = 0 // 未登录
	}
	// 返回数据
	c.Ctx.WriteString(fmt.Sprintf("%v", result))
}

// 获取用户信息
func (c *GetUserInfoCtrl) Post() {
	admit := c.GetSession("admit")

	if admit == true {
		uid := c.GetSession("uid")
		// 构造查询
		var userData User

		// 执行 SQL 语句
		o := orm.NewOrm()
		o.Raw("SELECT * FROM userdata WHERE Id=?", uid).QueryRow(&userData)

		c.Data["json"] = &userData

		c.ServeJSON()
	}
}

// 用户登录
func (c *LoginCtrl) Post() {
	result := 0 // 未登录
	// 验证登录
	admit := c.GetSession("admit")
	if admit == true {
		//result = 1 // 已登录
	} else {
		// json数据处理
		var loginJson LoginJson
		err1 := json.Unmarshal(c.Ctx.Input.RequestBody, &loginJson)
		if err1 != nil {
			log.Fatal(err1)
		}

		m := md5.New()
		_, err2 := io.WriteString(m, string(loginJson.Pw))
		if err2 != nil {
			log.Fatal(err2)
		}

		PwCode := m.Sum(nil)               // 已经输出，但是是编码
		PwArr := fmt.Sprintf("%x", PwCode) // 将编码转换为字符串

		// 构造查询
		var userData User

		// 执行 SQL 语句
		o := orm.NewOrm()
		o.Raw("SELECT * FROM userdata WHERE username= ? AND password= ?", loginJson.Un, PwArr).QueryRow(&userData)

		//用户信息验证
		if userData.Id != 0 {
			c.SetSession("admit", true)
			c.SetSession("uid", userData.Id)
			c.SetSession("un", userData.Un)
			c.SetSession("tbn", userData.Tb)
			result = 2 // 登录成功
		} else {
			result = 3 // 登录失败
		}
	}
	// 返回数据
	c.Ctx.WriteString(fmt.Sprintf("%v", result))
}

// 用户登出
func (c *LogoutCtrl) Post() {
	result := 0 // 未登录
	// 验证登录
	admit := c.GetSession("admit")
	if admit == true {
		c.DelSession("uid")
		c.DelSession("un")
		c.DelSession("tbn")
		c.SetSession("admit", false)
		result = 1 // 已退出登录
	}
	// 返回数据
	c.Ctx.WriteString(fmt.Sprintf("%v", result))
}

// 修改用户密码
func (c *ChangePwCtrl) Post() {
	result := 0 // 未登录
	// 若用户未登录则设定Session为未登录状态
	if c.GetSession("admit") == nil {
		c.SetSession("admit", false)
	}
	admit := c.GetSession("admit")
	if admit == true {
		if c.GetSession("authen") != true {
			result = 1 // 未认证用户身份
		}

		// 返回数据
		c.Ctx.WriteString(fmt.Sprintf("%v", result))
	}
}

//功能性函数
