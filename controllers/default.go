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

type McGetMissionCtrl struct {
	beego.Controller
}

type McAddMissionCtrl struct {
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

// SQL用户查询对象
type User struct {
	Id int    `orm:"column(Id);pk"`
	Un string `orm:"column(username)"`
	Tb string `orm:"column(tablename)"`
}

type Mission struct {
	Til string `orm:"column(title)"`
	Des string `orm:"column(describe)"`
	Lst string `orm:"column(lasttime)"`
	Mod string `orm:"column(mode)"`
	Sta string `orm:"column(status)"`
	Pid string `orm:"column(paraid)"`
	Pnu string `orm:"column(paranum)"`
	Stt string `orm:"column(starttime)"`
	Edt string `orm:"column(endtime)"`
}

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
	result := 0

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
				result = 2 // 插入成功
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

// 获取回收箱
func (c *McReLiCtrl) Get() {

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
		c.DelSession("tbn")
		c.SetSession("admit", false)
		result = 1 // 已退出登录
	}
	// 返回数据
	c.Ctx.WriteString(fmt.Sprintf("%v", result))
}

//功能性函数
