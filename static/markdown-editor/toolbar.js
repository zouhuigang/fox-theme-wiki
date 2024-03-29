//拖入打开md
document.addEventListener('drop', function(e){
      e.preventDefault();
      e.stopPropagation();

      var reader = new FileReader();
      reader.onload = function(e){
        editor.setValue(e.target.result);
      };

      reader.readAsText(e.dataTransfer.files[0]);
    }, false);

//保存为markdown
 function saveAsMarkdown(){
      save(editor.getValue(), "newuntitled.md");
}

//保存为html
function saveAsHtml() {
      save(document.getElementById('out').innerHTML, "untitled.html");
}

//监听点击保存事件
 document.getElementById('saveas-markdown').addEventListener('click', function() {
      saveAsMarkdown();
      hideMenu();
 });
 
 document.getElementById('saveas-html').addEventListener('click', function() {
      saveAsHtml();
      hideMenu();
    });
	
//保存函数
function save(code, name){
      var blob = new Blob([code], { type: 'text/plain' });
      if(window.saveAs){
        window.saveAs(blob, name);
      }else if(navigator.saveBlob){
        navigator.saveBlob(blob, name);
      }else{
        url = URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.setAttribute("href",url);
        link.setAttribute("download",name);
        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
        link.dispatchEvent(event);
      }
}

//监听关闭菜单按钮事件
var menuVisible = false;
var menu = document.getElementById('menu');
document.getElementById('close-menu').addEventListener('click', function(){
      hideMenu();
    });

//显示菜单
 function showMenu() {
      menuVisible = true;
      menu.style.display = 'block';
    }

//隐藏菜单
function hideMenu() {
      menuVisible = false;
      menu.style.display = 'none';
    }

//监听按键	
document.addEventListener('keydown', function(e){
      if(e.keyCode == 83 && (e.ctrlKey || e.metaKey)){
        e.shiftKey ? showMenu() : saveMd();

        e.preventDefault();
        return false;
      }

	  //ctrl+m 保存markdown
	  if(e.keyCode == 77 && (e.ctrlKey || e.metaKey)){
	        saveAsMarkdown();

            e.preventDefault();
            return false;
	  }

	  //ctrl+m 保存html
	  if(e.keyCode == 72 && (e.ctrlKey || e.metaKey)){
	        saveAsHtml();

            e.preventDefault();
            return false;
	  }

	  //预览文章
	  if(e.keyCode == 69 && (e.ctrlKey || e.metaKey)){
	        mdeye();

            e.preventDefault();
            return false;
	  }

      if(e.keyCode === 27 && menuVisible){
        hideMenu();

        e.preventDefault();
        return false;
      }
    });
	
//初始化编辑器=============

var URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
    navigator.saveBlob = navigator.saveBlob || navigator.msSaveBlob || navigator.mozSaveBlob || navigator.webkitSaveBlob;
    window.saveAs = window.saveAs || window.webkitSaveAs || window.mozSaveAs || window.msSaveAs;

    // Because highlight.js is a bit awkward at times
var languageOverrides = {
      js: 'javascript',
      html: 'xml'
    };

    emojify.setConfig({ img_dir: 'emoji' });

    var md = markdownit({
      html: true,
      linkify: true,
      highlight: function(code, lang){
        if(languageOverrides[lang]) lang = languageOverrides[lang];
        if(lang && hljs.getLanguage(lang)){
          try {
            return hljs.highlight(lang, code).value;
          }catch(e){}
        }
        return '';
      }
    }).use(markdownitFootnote);


    var hashto;

    function update(e){
      setOutput(e.getValue());

      clearTimeout(hashto);
      hashto = setTimeout(updateHash, 1000);
    }

    function setOutput(val){
      val = val.replace(/<equation>((.*?\n)*?.*?)<\/equation>/ig, function(a, b){
        return '<img src="http://latex.codecogs.com/png.latex?' + encodeURIComponent(b) + '" />';
      });

      var out = document.getElementById('out');
      var old = out.cloneNode(true);
      out.innerHTML = md.render(val);
      emojify.run(out);

      var allold = old.getElementsByTagName("*");
      if (allold === undefined) return;

      var allnew = out.getElementsByTagName("*");
      if (allnew === undefined) return;

      for (var i = 0, max = Math.min(allold.length, allnew.length); i < max; i++) {
        if (!allold[i].isEqualNode(allnew[i])) {
          out.scrollTop = allnew[i].offsetTop;
          return;
        } 
      }
    }

    var editor = CodeMirror.fromTextArea(document.getElementById('code'), {
      mode: 'gfm',
      lineNumbers:true,
      matchBrackets: true,
      lineWrapping: true,// 长句子折行
      theme: 'markdownpad2',//material,base16-light,dracula,markdownpad2
      extraKeys: {"Enter": "newlineAndIndentContinueMarkdownList"}
    });

    editor.on('change', update);
	editor.on('blur',blur);

	function blur(e){
		//alert("失去焦点"+e.getValue());
		var title =$("#title").val();
		if(!title){
			var obj=e.lineInfo(0);
	     	var v=obj.text;
		    $("#title").val(v);
		}
		
	}
	
	function updateHash(){
      window.location.hash = btoa( // base64 so url-safe
        RawDeflate.deflate( // gzip
          unescape(encodeURIComponent( // convert to utf8
            editor.getValue()
          ))
        )
      );
    }

    if(window.location.hash){
      var h = window.location.hash.replace(/^#/, '');
      if(h.slice(0,5) == 'view:'){
        setOutput(decodeURIComponent(escape(RawDeflate.inflate(atob(h.slice(5))))));
        document.body.className = 'view';
      }else{
        editor.setValue(
          decodeURIComponent(escape(
            RawDeflate.inflate(
              atob(
                h
              )
            )
          ))
        );
        update(editor);
        editor.focus();
      }
    }else{
      update(editor);
      editor.focus();
    }
	
//编辑器工具栏==========================================
var cm=editor;

//展开收起预览
document.getElementById('ShowHideView').addEventListener('click', function() {	
	ShowHideView();	 
});
//document.getElementById('homepage').addEventListener('click', function() {
//	  location.href='/';
//});
document.getElementById('editormd-bold1').addEventListener('click', function() {
	  h1();
});

document.getElementById('editormd-bold2').addEventListener('click', function() {
	  h2();
});

document.getElementById('fa-bold').addEventListener('click', function() {
	  bold();
});

document.getElementById('fa-italic').addEventListener('click', function() {
	  italic();
});

//新建文件
document.getElementById('fa-file-o').addEventListener('click', function() {	
	NewFile();
	 
});

//预览网页文章
document.getElementById('fa-eye').addEventListener('click', function() {	
	mdeye();
	 
});

//保存文件
document.getElementById('fa-save').addEventListener('click', function() {	
	saveMd();
	 
});

//左侧菜单关闭
document.getElementById('navToggler').addEventListener('click', function() {	
	showHideNav();
	 
});

//新建文件
document.getElementById('newFile').addEventListener('click', function() {	
	newMdFile();
});

//删除文件
document.getElementById('deleteFile').addEventListener('click', function() {	
	deleteMdFile();
});

//重命名文件
document.getElementById('renameFile').addEventListener('click', function() {	
	renameMdFile();
});






//打开文件
$("[type=\"file\"]").bind("change",readFileContent);
document.getElementById('fa-folder-open-o').addEventListener('click', function() {
	   $("#fa-folder-open-oinput").trigger("click");
});

function ShowHideView(){
	var att=$("#view").css("display");
	if(att=='flex'||att=='block'){
	   $("#view").css("display","none");	
	}else if(att=="none"){
		$("#view").css("display","flex");
	}

	
}

function showHideNav(){
  var att=$(".leftMenu").css("display");
	if(att=='flex'||att=='block'){
    $(".leftMenu").css("display","none");	
    $(".bodyEditor").css("left","0px");
    $("#navToggler").css("left","0px")
    $("#navToggler").addClass("navTogglerOn");
	}else if(att=="none"){
    $(".leftMenu").css("display","block");
    $(".bodyEditor").css("left","270px");
    $("#navToggler").css("left","270px");
    $("#navToggler").removeClass("navTogglerOn");
    
	}
}



//离开之前询问

function componentDidMount() {
    window.onbeforeunload = (event) => {
		var hasUnsavedData=true;
 		if (hasUnsavedData) {
        const dialogText = "本页面要求您确认您要离开 - 您输入的数据可能不会被保存?";
        event.returnValue = dialogText;
        return dialogText;
       }
    };
 
 // window.onbeforeunload =  onbeforeunload_handler;
  }


//生成密码
var is_open_int= $("#show-passwd").val();
if(!is_open_int){
	$("#show-passwd").hide();
}
$("#is_open").change(function(){
      var is_open= $(this).val();
	  if(is_open==2){
		 $("#show-passwd").show();
	    var share_password=createcode();
	    $("#show-passwd").val(share_password);
	  }else{
		$("#show-passwd").val('');
	    $("#show-passwd").hide();
	  }	 	 
});

//读取文件,拖拽或打开文件读取
function readFileContent(events) {
      events.preventDefault();
      events.stopPropagation();
	  
	  var r = (events.dataTransfer || events.target).files;  //dataTransfer:拖拽读取,target:打开文件读取

      var reader = new FileReader();
      reader.onload = function(e){
        editor.setValue(e.target.result);
      };
      reader.readAsText(r[0]);

 }



function h1(){
	//申明多个变量
	var e =cm,
	t = e.getCursor(e),  //返回光标所在元素 line:行,ch：列。
	i = e.getSelection(e);//得到选中的文字，如果未选，则为空
	console.log(i);
    0 !== t.ch ? (e.setCursor(t.line, 0), e.replaceSelection("# " + i), e.setCursor(t.line, t.ch + 2)) : e.replaceSelection("# " + i)
}

function h2() {
                var e = this.cm,
                t = e.getCursor(),
                i = e.getSelection();
                0 !== t.ch ? (e.setCursor(t.line, 0), e.replaceSelection("## " + i), e.setCursor(t.line, t.ch + 3)) : e.replaceSelection("## " + i)
}

//加粗
function bold() {
                var e = this.cm,
                t = e.getCursor(),
                i = e.getSelection();
                e.replaceSelection("**" + i + "**"),
                "" === i && e.setCursor(t.line, t.ch + 2)
}

//斜体
 function italic() {
                var e = this.cm,
                t = e.getCursor(),
                i = e.getSelection();
                e.replaceSelection("*" + i + "*"),
                "" === i && e.setCursor(t.line, t.ch + 1)
}
			
//替换文本
function  replaceSelection(e){
    return cm.replaceSelection(e);
}

function setCursor(e) {
    return cm.setCursor(e);
}

//去左右空格;
function trim(s){
    return s.replace(/(^\s*)|(\s*$)/g, "");
}

//保存
function saveMd(){
	  var md =cm.getValue();
		//选择的当前文件
    var fileName =$("#bg-mp3 li ._2qFpLQL4m3cyei3AiQBFsn").attr("data-path");
    if(!fileName){
      layer.msg("请选择文件");
      return false;
    }
		var tempObj={};
    tempObj["content"] = md;
		tempObj["fileName"] = fileName;
		
		$.ajax({
			     type: "POST",
	             url: "/markdown/save",
	             data:tempObj,
	             dataType: "json",
	             success: function(res){
                 if(res.error==0){
                  layer.msg("保存成功");
                 }else{
                  layer.msg(res.error_description);
                 }
                
				      }
		})	
}







//新建文件
function NewFile(){
	//window.location.href="/editor";
	window.open("/editor", "_blank");
}

function mdeye(){
	var id = parseInt($("#id").val())?parseInt($("#id").val()):0;
	if(!id){
	    layer.msg("亲，请先保存再来偷看哟...", {icon: 5});
		return false;
	}
	window.open("/vm/"+id, "_blank");
}

function createcode(){
		    code = "";  
            var codeLength = 4;//验证码的长度  
            var selectChar = new Array(0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z');//所有候选组成验证码的字符，当然也可以用中文的  
          
           for(var i=0;i<codeLength;i++){      
             var charIndex = Math.floor(Math.random()*36);  
             code +=selectChar[charIndex];  
            } 

		    return code;

}

//选择markdown
$(document).ready(function(){
  $("#bg-mp3 li").click(function(){
	 var str_html="<div class=\"_2PNRJNNjA4_U0YygXkoknR _2RuoFSLh7mJSxuKSstubYq _22-PtjvtC0DQ2_r5-t3Im7\"></div>";
	 $("#bg-mp3 li ._2fu3EvuSxkRWBPBgPUk19_").removeClass("_2qFpLQL4m3cyei3AiQBFsn");//移除其他li的颜色
	 $("#bg-mp3 li ._2fu3EvuSxkRWBPBgPUk19_ div").remove("._2PNRJNNjA4_U0YygXkoknR");

    $(this).find("._2fu3EvuSxkRWBPBgPUk19_").addClass("_2qFpLQL4m3cyei3AiQBFsn").append(str_html); //字体颜色

    //查询markdown信息
    var mdPath =$("#bg-mp3 li ._2qFpLQL4m3cyei3AiQBFsn").attr("data-path");
    getMdInfo(mdPath)
  });
});

function newMdFile(){
    //文件名称
    layer.prompt({title: '新建文件',value:"", formType: 0,maxlength: 140}, function(fileName, index){
         var tempObj={};
         tempObj["fileName"]=fileName
          $.ajax({
                  type: "POST",
                      url: "/make/file",
                      data:tempObj,
                      dataType: "json",
                      success: function(data){
                      if(data.error==0){
                          layer.msg("创建成功");
                          layer.close(index);
                      }else{
                        layer.msg(data.error_description);
                        //alert(data.error_description);
                      }
          
                //setTimeout("window.location.reload()",1000);
                }
          })	
    });
}

//删除文件
function deleteMdFile(){
  //选择的当前文件
  var fileName =$("#bg-mp3 li ._2qFpLQL4m3cyei3AiQBFsn").attr("data-path");
  if(!fileName){
    layer.msg("请选择文件");
    return false;
  }

  //文件名称
  layer.confirm(fileName, {
    title: '确认删除文件?',
    btn: ['删除','取消'] //按钮
  }, function(index){//确认
         var tempObj={};
         tempObj["fileName"]=fileName
          $.ajax({
                  type: "POST",
                      url: "/markdown/delete",
                      data:tempObj,
                      dataType: "json",
                      success: function(data){
                      if(data.error==0){
                          layer.msg("删除成功");
                          layer.close(index);
                      }else{
                        layer.msg(data.error_description);
                        //alert(data.error_description);
                      }
                }
          })	
  }, function(){//取消
   
  });
}

function renameMdFile(){
  //选择的当前文件
  var fileName =$("#bg-mp3 li ._2qFpLQL4m3cyei3AiQBFsn").attr("data-path");
  if(!fileName){
    layer.msg("请选择文件");
    return false;
  }

  var oldName =$("#bg-mp3 li ._2qFpLQL4m3cyei3AiQBFsn").attr("data-name");

  //文件名称
  layer.prompt({title: '重命名文件',value:oldName, formType: 0,maxlength: 140}, function(newName, index){
    var tempObj={};
    tempObj["fileName"]=fileName
    tempObj["newName"]=newName
     $.ajax({
             type: "POST",
                 url: "/markdown/rename",
                 data:tempObj,
                 dataType: "json",
                 success: function(data){
                 if(data.error==0){
                     layer.msg("重命名成功");
                     layer.close(index);
                 }else{
                   layer.msg(data.error_description);
                   //alert(data.error_description);
                 }
     
           //setTimeout("window.location.reload()",1000);
           }
     })	
});
}

function getMdInfo(filePath){
        var tempObj={};
        tempObj["fileName"]=filePath
        editor.setValue('');
        $.ajax({
          type: "POST",
              url: "/markdown/info",
              data:tempObj,
              dataType: "json",
              success: function(res){
              if(res.error==0){
                editor.setValue(res.result.info);
              }else{
                layer.msg(res.error_description);
              }
        }
      })	
}

