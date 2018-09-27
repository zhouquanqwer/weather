/**
 * Created by Administrator on 2018/9/26.
 */
// $(function () {
    //获取当前城市的天气信息
    let tianqi;
    $.ajax({
        type:"get",
        url:"https://www.toutiao.com/stream/widget/local_weather/data/?city=太原",
        dataType:"jsonp",
        success:function(obj) {
            // console.log(obj);
            tianqi = obj.data;
            updata(tianqi)
        }
    });

    function updata(tianqi) {
        $("header>h2>span").html(tianqi.city);
        $(".pollution>span").html(tianqi.weather.quality_level);
        $(".weather>h1").html(tianqi.weather.current_temperature+"°");
        $(".weather>p").html(tianqi.weather.current_condition);
        let level = tianqi.weather.wind_level;
        $(".weather>span").html(tianqi.weather.wind_direction+level+"级");


        $(".temp-left>p").eq(1).html(tianqi.weather.forecast_list[1].condition);
        $(".temp-right>p").eq(0).html(tianqi.weather.forecast_list[1].low_temperature+"/"+tianqi.weather.forecast_list[1].high_temperature+"℃");
        $(".temp-right>p").eq(1).html(tianqi.weather.forecast_list[2].low_temperature+"/"+tianqi.weather.forecast_list[2].high_temperature+"℃")
        $(".temp-left>p").eq(3).html(tianqi.weather.forecast_list[2].condition);
        $(".right").eq(0).attr("src","./img/7.png");


        let hweather = tianqi.weather.hourly_forecast;
        hweather.forEach(function (v) {
            let str = `
                 <li>
                    <p>${v.hour}:00</p>
                    <img src="./img/${v.weather_icon_id}.png" alt="">
                    <span>${v.temperature}°</span>
                 </li>
            `;
            $(".time-content").append(str);
        });

        let fweather = tianqi.weather.forecast_list;

        for(let i = 0;i<6;i++){
            let str = `
                <li>
                    <p>${fweather[i].date.slice(5,10)}</p>
                    <span class="morning">${fweather[i].condition}</span>
                    <div class="state1">
                        <img src="./img/${fweather[i].weather_icon_id}.png" alt="">
                    </div>
                    <div class="state2">
                        <img src="./img/31.png" alt="">
                    </div>
                    <span class="evening">多云</span>
                    <p>${fweather[i].wind_direction}</p>
                    <p>${fweather[i].wind_level}级</p>
                </li>
            `;
            $(".everyday").append(str);
        }
    }
    //添加城市
    let city;
    $.ajax({
        type:"get",
        url:"https://www.toutiao.com/stream/widget/local_weather/city/",
        dataType:"jsonp",
        success:function (obj) {
            city = obj.data;
            updataCity(city);
        }
    });
    let con ;
    function updataCity(city) {
        for(let i in city){
            // let ul = document.createElement("ul");
            let str1 = `
                <p class="province">${i}</p>
                `;
            $("ul.hot").append(str1);
            for(let j in city[i]){
            let str = `
                <li class="location">${j}</li>
                `;
            $("ul.hot").append(str);
            }
        }

    }
    //新的城市信息
    function ajaxs(con) {
        $(".search").css({"transform":"translateX(-7.5rem)","transition": "all 0.5s"});
        $(".main").css({"display":"block"});
        let url1 = "https://www.toutiao.com/stream/widget/local_weather/data/?city="+con;
        $.ajax({
            type:"get",
            url:url1,
            dataType:"jsonp",
            success:function (obj) {
                city = obj.data;
                $(".time-content>li").remove();
                $(".everyday>li").remove();
                updata(city);
            }
        })
    }

let arr = ["徐州","太原"];
    window.onload=function () {
        //历史存储
        let a = JSON.parse(localStorage.getItem("historyCity"));
        if(!a){
        localStorage.setItem("historyCity",JSON.stringify(arr))};
        arr=JSON.parse(localStorage.getItem("historyCity"));
        for(let i in arr){
            let str = `
                    <li class="location">${arr[i]}</li>
                `
            $(".history").append(str);
        }
        //页面跳转
        $("header>h2").click(function () {
            $(".search").css({"transform":"translateX(0)","transition": "all 0.5s"});
            $(".main").css({"display":"none"});
        });
        $(".search-header>p>i").click(function () {
            $(".search").css({"transform":"translateX(-7.5rem)","transition": "all 0.5s"});
            $(".main").css({"display":"block"});
        });
        $(".search li").click(function () {
            con=$(this).html();
            // console.log(con);
            ajaxs(con);
            history(con)
        });
        //文本框输入
        $("input").focus(function () {
            let flag =false;
            $(".search-text span").html("搜索");
            $(".search-text span").click(function () {
                con = $("input").val();
                for(let i in city){
                    for(let j in city[i]){
                        if(j==con){
                            flag=true;
                            break;
                        }
                    }
                }
                if(flag==true) {
                    ajaxs(con);
                    history(con);
                    $(".search-text span").html("取消");
                    $("input").val("");
                     flag =false;
                    return;
                }else{
                    $(".search-text span").html("取消");
                    $("input").val("");
                    alert("输入格式有误");
                    return;
                }
            })
        });
    };
    //历史纪录
    function history(con) {
        let str = `
                    <li class="location">${con}</li>
                `
        $(".history").append(str);
        $(".history>li").click(function () {
            con=$(this).html();
            ajaxs(con)
        });
        // console.log(arr);
        arr.push(con);
        localStorage.setItem("historyCity",JSON.stringify(arr));
    }

// });
