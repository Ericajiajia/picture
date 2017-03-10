window.onload = function () {


    var main = document.getElementById("main");
    var showBox = document.getElementById("showBox");
    var height = window.innerHeight / 3;
    var lastRow = 0;
    var boolean = false;//判断showBox是否显现

   var createImg=function(picIndex) {//创建img标签
        var imgTag = document.createElement("img");
        imgTag.setAttribute("src", pictures[picIndex].src);
        imgTag.setAttribute("height", height + "px");
        imgTag.title = pictures[picIndex].title;
        imgTag.alt = pictures[picIndex].title;
        return imgTag;
    }

    //换行代码
    var nextRow=function(picIndex,roWidth) {
        var temp = pictures[picIndex];
        if ( roWidth + temp.width * (height / temp.height)>= main.getBoundingClientRect().width) {
            return true;
        }
        return false;
    }

    var heightChange=function(div, wid)//每行都是一个Div,每行都看成一个整体，集体调整高度。
    {
        var child=div.children;
        for(var i=0;i<child.length;i++) {
            child[i].height/=wid;
        }
    }


   var div_array=function(length) {
        var row=0;//记录行数
        var picIndex=0;//图片索引值
        var rowNum=0;//每行图片个数
        var picNum=0;//当前图片数
        var roWidth=0;//每行宽度
        var Array = [];//div的数组
        var bool;//判断事件是否会发生
        var div = document.createElement("div");
        div.setAttribute("class", "box");
        while (length>picNum)
        {
            div.appendChild(createImg(picIndex));
            roWidth= roWidth+pictures[picIndex].width * (height / pictures[picIndex].height);
            roWidth+=10;
            rowNum++;
            bool=nextRow( picIndex,roWidth);
            if (bool)
            {
                heightChange(div,roWidth / window.innerWidth );//调整高度
                div.setAttribute("rowNum", row++);//添加行数
                Array.push(div);
                main.appendChild(div);
                div = document.createElement("div");
                div.setAttribute("class", "box");
                roWidth = rowNum = 0;
            }
            picIndex = ++picNum % pictures.length;//每次循环从头开始；
        }
        return Array;
    }

    div_array(pictures.length);


    main.addEventListener("click", function (e) {
        var img = e.target;
        if (img.tagName === "IMG") {
            var box = img.parentNode;
            var box_rect = box.getBoundingClientRect();
            var row = box.getAttribute("data-row");
            if(row != lastRow) {
                scrollTo(0, box.offsetTop + box_rect.height / 2);// 自动移动到合适位置
            }
            // 填充详情块的信息
            var d = showBox.children;
            d[0].children[0].setAttribute("src", img.getAttribute("src"));
            d[1].children[0].innerHTML = img.title;
            // 图片向上重新布局
            if(boolean)
                move(0,box.nextSibling,"translate3d(0,0,0)");
            showBox.style.opacity = 1;
            showBox.style.top = box.offsetTop + box_rect.height + 15 + "px";//!!!!!
            boolean = true;
            move(1,box,"translate3d(0,330px,0)");
            lastRow = row;
        }
        else {
            var c = main.children;
            // 隐藏详情块
            showBox.style.opacity = 0;
            boolean = false;
            // 重排图片布局
            for(var i = 1; len = c.length,i < len;i ++) {
                c[i].style.transform = "translate3d(0,0,0)";
            }
        }
    })



    var move=function(bool,box,property) {//判断盒子模型应该向上平移还是向下平移。
        var boxy = box;
        while(typeof boxy == "object") {
            boxy = bool ? box.nextSibling : box.previousSibling;
            if(boxy.style) {
                boxy.style.transform = property;
                box = boxy;
            }
            else {
                return false;
            }
        }
    }

    window.onscroll = function () {
        var clientHeight = document.body.clientHeight;
        var clientTop = document.body.scrollTop;
        var gap = (clientHeight - clientTop);
        if(gap <=900) {
            var array = div_array(pictures.length);
            if(boolean) {
                for(var i = 0; len = array.length, i < len;i ++) {
                    array[i].style.transform = "translate3d(0,350px,0)";
                }
            }
        }
    }

    var scrollTo=function(x,y) {//滚动到正确位置
        var request=function() {
            window.scrollBy(0,window.scrollY - y> 0 ? -5 : 5);
            if(Math.abs(window.scrollY - y) > 5) {//控制位置
                var cancel = requestAnimationFrame(request);
            }
            else
                cancelAnimationFrame(cancel);
        }
        requestAnimationFrame(request);
    }

    window.onresize = function () {setTimeout("location.reload()",100);}//改变视图的时候重新排版,重新运行一遍程序

}