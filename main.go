package main

import (
	_ "cips-ng/routers"

	"github.com/astaxie/beego"
)

func main() {
	beego.SetStaticPath("/views", "static/views")
	beego.Run()
}
