if(typeof(_localeMsg) == 'undefined')_localeMsg = {};

function getLocMsg(key){if(key==null)return '';var val=_localeMsg[key];return val || key;}

function promisManuelAjaxObject(){ //bu Fonksiyon kullanilmiyor. fakat ileride senkron islemler icin kullanilabilir.(27/12/2012 itibariyle de kur_cevir_sync de kullanılıyor)
	var xmlhttp = null;	
	try{
		xmlhttp = new XMLHttpRequest();
	}catch(err1){
		var ieXmlHttpVersions = new Array();
		ieXmlHttpVersions[ieXmlHttpVersions.length] = "MSXML2.XMLHttp.7.0";
		ieXmlHttpVersions[ieXmlHttpVersions.length] = "MSXML2.XMLHttp.6.0";
		ieXmlHttpVersions[ieXmlHttpVersions.length] = "MSXML2.XMLHttp.5.0";
		ieXmlHttpVersions[ieXmlHttpVersions.length] = "MSXML2.XMLHttp.4.0";
		ieXmlHttpVersions[ieXmlHttpVersions.length] = "MSXML2.XMLHttp.3.0";
		ieXmlHttpVersions[ieXmlHttpVersions.length] = "MSXML2.XMLHttp";
		ieXmlHttpVersions[ieXmlHttpVersions.length] = "Microsoft.XMLHttp";
		var i;
		for (i=0; i < ieXmlHttpVersions.length; i++)try{
			xmlhttp = new ActiveXObject(ieXmlHttpVersions[i]);
			break;
		}catch (err2){
			Ext.Msg.alert(getLocMsg('js_bilgi'), ieXmlHttpVersions[i] + " not supported.");
		}
	}
	return xmlhttp;
}


function objProp(o){
	var t="";
	for(var q in o)t+=o[q] instanceof Function ? q + " = function{}\n" : q + " = " + o[q] + "\n";
	return t;
}


function obj2ArrayString(o,ml){
	if(!ml)ml=0;
	if(ml>3)return "";
	var t="[";
	var b=false;
	for(var qi=0;qi<o.length;qi++){
		var n=o[qi];
		if(n && !(n instanceof Function)){
			if(b)t+=",\n"; else b=true;
			switch(typeof n){
			case 'object':
				if(n instanceof Array){
					t+=obj2ArrayString(n,ml+1);
				} else if(n instanceof Date){
					t+='"' + fmtDateTime(n) + '"';
				} else {
					t+=obj2JsonString(n,ml+1);
				}
				break;
			case 'string':
				t+='"' + n + '"';
				break;
			default:
				t+=n ;
				break;
			}
		}
	}
	t+="]";
	return t;
}

function obj2JsonString(o,ml){
	if(!ml)ml=0;
	if(ml>3)return "";
	
	var t="{";
	var b=false;
	for(var q in o){
		var n=o[q];
		if(n && !(n instanceof Function)){
			if(b)t+=","; else b=true;
			switch(typeof n){
			case 'object':
				if(n instanceof Array){
					t+='"'+q +'" : "' + obj2ArrayString(n,ml+1);
				} else if(n instanceof Date){
					t+='"'+q + '" :"' + fmtDateTime(n) + '"';
				} else {
					t+='"'+q + '":' + obj2JsonString(n,ml+1);
				}
				break;
			case 'string':
				t+='"'+q + '":"' + n + '"';
				break;
			default:
				t+='"'+ q + '" : ' + n ;
				break;
			}
		}
	}
	t+="}";
	return t;
}

function gridStore2JsonString(ds){
	var items=ds.data.items;
	var newItems=[]
	for(var qi=0;qi<items.length;qi++)newItems.push({id:items[qi].id,data:items[qi].json});
	return obj2ArrayString(newItems)

}

function promisLoadException(a,b,c){
    if(c && c.responseText){
        ajaxErrorHandler(eval("("+c.responseText+")"));
    } else {
//    	Ext.Msg.show({title:getLocMsg('js_bilgi'),msg: getLocMsg('js_no_connection_error'),icon: Ext.MessageBox.WARNING})
    	showStatusText(getLocMsg('js_no_connection_error'), 3);//error
    }
}

function hideStatusText(){
	var c1 = Ext.getCmp('idSouthBox');
	c1._level=0;
	if(c1.isVisible()){
		c1.hide();
		mainViewport.doLayout();
		var c2=Ext.get('footer2').dom;
		c2.className=c2._oldClassName;
	}
}




function showStatusText(txt, level){ //0:debug, 1:info, 2:warning, 3:error
	var c1 = Ext.getCmp('idSouthBox');
	if(!level)level=0;
	if(!c1._level)c1._level=0;


	
	if(!c1.isVisible()){
		var c2=Ext.get('footer2').dom;
		c2._oldClassName=c2.className;
		c1.show();
		mainViewport.doLayout();
		c2._newClassName=c2.className;
	}
	if(level>=c1._level){
		var c2=Ext.get('footer2').dom, t2='';
		switch(level){
		case	1:t2='information';break;
		case	2:t2='warning';break;
		case	3:t2='error';break;
		default:t2='';break;
		}
		c2.className=c2._newClassName+' '+t2;
		c2.textContent=txt;
		c1._level=level;
	}	
}

function getScreenSize() {
  var myWidth = 0, myHeight = 0;
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
    //IE 4 compatible
    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
  }
  return {"width": myWidth, "height": myHeight};
}

function getCookie(c_name){
	if(document.cookie.length>0){
		c_start=document.cookie.indexOf(c_name + "=");
		if (c_start!=-1){
		    c_start=c_start + c_name.length+1;
		    c_end=document.cookie.indexOf(";",c_start);
		    if (c_end==-1) c_end=document.cookie.length;
		    return unescape(document.cookie.substring(c_start,c_end));
		}
	}
	return "";
}


function disabledCheckBoxHtml(x){
	return	'<img src="../images/custom/'+(x!=0?'':'un')+'checked.gif" border=0>';
}

function accessControlHtml(x){
	return	x ? '<img src="../images/custom/bullet_key.png" border=0>':'';
}

function fileAttachmentHtml(x){
	return	x ? '<img src="../images/custom/bullet_file_attach.png" border=0>':'';
}


function fileAttachmentRenderer(a){
	return function(ax,bx,cx){
		return	ax ? '<img src="../images/custom/bullet_file_attach.png" border=0 onclick="mainPanel.loadTab({attributes:{modalWindow:true, _title_:\''+a.name+'\',href:\'showPage?_tid=518&_gid1=458&_gid458_a=1\',_pk:{tfile_attachment_id:\'file_attachment_id\'},baseParams:{xtable_id:'+a.crudTableId+', xtable_pk:'+cx.id+'}}});">':'';
	};
}

function gridGraphMarkerRenderer(a){
	return function(ax,bx,cx){
		if(a.gcmm && a.gcmi){
			var q = cx.get(a.gcmi);
			if(q){
				q=a.gcmm[q];
				if(q)bx.attr='style="background-color:'+q+';"';
			}
			
		}// else bx.attr='style="background-color:blue;"';
		return '';
	};
}

function commentRenderer(a){
	return function(ax,bx,cx){
		if(ax){
			if(cx.data.pkpkpk_cf_ext){
				var axx=cx.data.pkpkpk_cf_ext;
				bx.attr += ' ext:qtip=" <b>' +axx.user_dsc+ '</b>: '+ Ext.util.Format.htmlEncode(axx.msg) + '<br/><span class=cfeed> · '+Ext.util.Format.htmlEncode(axx.last_dttm)+'</span>"';
				return '<img src="../images/custom/bullet_comment'+(axx.is_new ?'_new':'')+'.png" border=0 onclick="mainPanel.loadTab({attributes:{modalWindow:true, _title_:\''+a.name+'\',href:\'showPage?_tid=836\',slideIn:\'t\',_pk:{tcomment_id:\'comment_id\'},baseParams:{xtable_id:'+a.crudTableId+', xtable_pk:'+cx.id+'}}});">';
			} else
				return '<img src="../images/custom/bullet_comment.png" border=0 onclick="mainPanel.loadTab({attributes:{modalWindow:true, _title_:\''+a.name+'\',href:\'showPage?_tid=836\',slideIn:\'t\',_pk:{tcomment_id:\'comment_id\'},baseParams:{xtable_id:'+a.crudTableId+', xtable_pk:'+cx.id+'}}});">';
		} else return '';
	};
}

function commentRenderer2(a){
	return function(ax,bx,cx){
		if(ax){
			if(cx.data.pkpkpk_cf_ext){
				var axx=cx.data.pkpkpk_cf_ext;
				bx.attr += ' ext:qtip=" <b>' +axx.user_dsc+ '</b>: '+ Ext.util.Format.htmlEncode(axx.msg) + '<br/><span class=cfeed> · '+Ext.util.Format.htmlEncode(axx.last_dttm)+'</span>"';
				var cnt=1*cx.data.pkpkpk_cf;
				if(cnt>9)cnt="+9";
				return '<b style="color:'+(axx.is_new ?'red':'rgb(163,181,217)')+'">'+cnt+'</b> <img src="../images/custom/bullet_comment.png" border=0 onclick="mainPanel.loadTab({attributes:{modalWindow:true, _title_:\''+a.name+'\',href:\'showPage?_tid=836\',slideIn:\'t\',_pk:{tcomment_id:\'comment_id\'},baseParams:{xtable_id:'+a.crudTableId+', xtable_pk:'+cx.id+'}}});">';
			} else
				return '<img src="../images/custom/bullet_comment.png" border=0 onclick="mainPanel.loadTab({attributes:{modalWindow:true, _title_:\''+a.name+'\',href:\'showPage?_tid=836\',slideIn:\'t\',_pk:{tcomment_id:\'comment_id\'},baseParams:{xtable_id:'+a.crudTableId+', xtable_pk:'+cx.id+'}}});">';
		} else return '';
	};
}

function commentHtml(x){
	return	x ? '<img src="../images/custom/bullet_comment.png" border=0>':'';
}

function pictureHtml(x){
	return	x ? '<img src="../images/custom/bullet_picture.png" border=0>':'';
}

function keywordHtml(x){
	return	x ? '<img src="../images/custom/bullet_keyword.png" border=0>':'';
}

function revisionHtml(x){
	return	x==1 ? '<img src="../images/custom/revision1.png" border=0>':'';
}

function approvalHtml(x,y,z){
	if(!x)return '';
	var str=(x>0) ? '<img src="../images/custom/bullet_approval.gif" border=0> ':'';
	str+='<a href=# onclick="return mainPanel.loadTab({attributes:{modalWindow:true,href:\'showPage?_tid=238&_gid1=530\',baseParams:{xapproval_record_id:'+z.data.pkpkpk_arf_id+'}}})"';
	if(z.data.app_role_ids_qw_ || z.data.app_user_ids_qw_){
		str+=' title=":'+getLocMsg('js_onaylayacaklar');
		var bb=false;
		if(z.data.app_role_ids_qw_){
			str+=' ['+getLocMsg('js_roller')+': '+z.data.app_role_ids_qw_+']';
			bb=true;
		}
		if(z.data.app_user_ids_qw_){
			if(bb)str+=",";
			str+=' ['+getLocMsg('js_users')+': '+z.data.app_user_ids_qw_+']';
		}
		str+='"';
	}
	str+='>'+z.data.pkpkpk_arf_qw_+'</a>';
	return	str;
}

function wideScreenTooltip(value, metadata, record, rowIndex, colIndex, store){
	if(value){ metadata.attr += ' ext:qtip=" <b>' + Ext.util.Format.htmlEncode(value) + '</b>"';}
	return value;
}



function mailBoxRenderer(a){
	return function(ax,bx,cx){
		return	ax ? '<img src="../images/custom/bullet_mail.gif" border=0 onclick="mainPanel.loadTab({attributes:{modalWindow:true, _iconCls:\'icon-email\', _title_:\''+a.name+'\',href:\'showPage?_tid=518&_gid1=874\',baseParams:{xtable_id:'+a.crudTableId+',xtable_pk:'+cx.id+'}}});">':'';
	};
}

function fmtDecimal(value){
	if(!value)return '0';
	var digit=(_app.number_decimal_places*1 || 4);	
	var result = Math.round(value*Math.pow(10,digit))/Math.pow(10,digit)+'';
	var s=1*result<0?1:0;
	var x=result.split('.');
	var x1=x[0],x2=x[1];
	for(var i=x1.length-3;i>s;i-=3)x1=x1.substr(0,i)+(_app.digit_separator || '.')+x1.substr(i);
	if(x2 && x2>0) return x1+(_app.decimal_separator || ',')+x2;
	return x1;	
}

function fmtDecimalNew(value,digit){
	if(!value)return '0';
	if(!digit)digit=(_app.number_decimal_places*1 || 4);	
	var result = Math.round(value*Math.pow(10,digit))/Math.pow(10,digit)+'';
	var s=1*result<0?1:0;
	var x=result.split('.');
	var x1=x[0],x2=x[1];
	for(var i=x1.length-3;i>s;i-=3)x1=x1.substr(0,i)+(_app.digit_separator || '.')+x1.substr(i);
	if(x2 && x2>0) return x1+(_app.decimal_separator || ',')+x2;
	return x1;	
}

function fmtParaShow(value){
	if(!value) value = '0';
	var digit=(_app.money_decimal_places*1 || 4);	
	var result = Math.round(value*Math.pow(10,digit))/Math.pow(10,digit)+'';
	var s=1*result<0?1:0;
	var x=result.split('.');
	var x1=x[0],x2=x[1];
	if(!x2) x2='0';
	
	for (var j=x2.length; j<digit; j++){
		x2 = x2 + '0'; 
	}
	
	for(var i=x1.length-3;i>s;i-=3)x1=x1.substr(0,i)+(_app.digit_separator || '.')+x1.substr(i);
	return x1+(_app.decimal_separator || ',')+x2;
}

function fmtPrice(value){
	if(!value) value = '0';
	var digit=(_app.price_decimal_places*1 || 4);	
	var result = Math.round(value*Math.pow(10,digit))/Math.pow(10,digit)+'';
	var s=1*result<0?1:0;
	var x=result.split('.');
	var x1=x[0],x2=x[1];
	if(!x2) x2='0';
	
	for (var j=x2.length; j<digit; j++){
		x2 = x2 + '0'; 
	}
	
	for(var i=x1.length-3;i>s;i-=3)x1=x1.substr(0,i)+(_app.digit_separator || '.')+x1.substr(i);
	return x1+(_app.decimal_separator || ',')+x2;
}

function getGridSel (a){
  if(!a || !a._grid || !a._grid.sm.getSelected()){
    Ext.Msg.show({title: getLocMsg('js_commons_info'), msg: getLocMsg('js_commons_error_secim'), icon: Ext.MessageBox.INFO});
    return null;
  }
  else {
    return a._grid.sm.getSelected();
  }
}

function getMasterGridSel (a){
  if(!a || !a._grid || !a._grid._masterGrid || !a._grid._masterGrid.sm.getSelected()){
    Ext.Msg.show({title: getLocMsg('js_commons_info'), msg: getLocMsg('js_commons_error_secim'), icon: Ext.MessageBox.INFO});
    return null;
  }
  else {
    return a._grid._masterGrid.sm.getSelected();
  }
}

function fmtFileSize(a){
	if(!a)return '-';;
	a*=1;
	var d='B';
	if(a>1024){a=a/1024;d='KB';}
	if(a>1024){a=a/1024;d='MB';}
	if(a>1024){a=a/1024;d='GB';}
	if(d!='B')a=Math.round(a*10)/10;
	return a+' '+d;
}

function fmtTimeAgo(a){
	if(!a)return '-';;
	a=Math.round((1*a)/1000);
	var d=getLocMsg('js_saniye');
	if(a>60){
		a=Math.round(a/60);d=getLocMsg('js_dakika');
		if(a>60){
			a=Math.round(a/60);d=getLocMsg('js_saat');
			if(a>24){
				a=Math.round(a/24);d=getLocMsg('js_gun');
			}else if(a>15){
				return getLocMsg('js_yaklasik_bir_gun');
			}
		}else if(a>40){
			return getLocMsg('js_yaklasik_bir_saat');
		}
	} else if(a>40){
		return getLocMsg('js_yaklasik_bir_dakika');
	}
	return a+' '+d+' '+getLocMsg('js_ago');
}

function fmtShortDate(x){
	return x ? (x.dateFormat ? x.dateFormat('d/m/Y') : x) : "";
}

function fmtDateTime(x){
	return x ? (x.dateFormat ? x.dateFormat('d/m/Y H:i:s') : x) : "";
}

function fmtDateTimeWithDay(x,addsec){
	if(addsec){
		return x ? (x.dateFormat ? x.dateFormat('d/m/Y H:i:s D') : x) : "";
	}
	else{
		return x ? (x.dateFormat ? x.dateFormat('d/m/Y H:i D') : x) : "";		
	}
}

function fmtDateTimeWithDay2(x){
	return x ? (x.dateFormat ? x.dateFormat('d/m/Y H:i:s D') : x) : "";
}


var daysOfTheWeek={tr:['Pazar', 'Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'],en:['Sunday', 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']};
var xtimeMap={tr:['az önce', 'bir dakika önce','dakika önce','saat önce','dün'],en:['seconds ago', 'a minute ago','minutes ago','hours ago','yesterday']};
function fmtDateTimeAgo(dt2){
	if(!dt2)return '';
	var tnow = new Date().getTime();
	var t = dt2.getTime();
	var xt=xtimeMap[_scd.locale]||{};
	if(t+30*1000>tnow)return xt[0];//'Az Önce';//5 sn
	if(t+2*60*1000>tnow)return xt[1];//'Bir Dakika Önce';//1 dka
	if(t+60*60*1000>tnow)return Math.round((tnow-t)/(60*1000)) + xt[2];//' Dakika Önce';
	if(t+24*60*60*1000>tnow)return Math.round((tnow-t)/(60*60*1000)) + xt[3];//' Saat Önce';
	if(t+2*24*60*60*1000>tnow)return xt[4];//'Dün';
	if(t+7*24*60*60*1000>tnow)return daysOfTheWeek[_scd.locale][dt2.getDay()];//5dka
	return dt2.dateFormat('d/m/Y');
}

function buildParams(params, map){
	var bp={};
	for(var key in params){
		var newKey = params[key];
		if(typeof newKey == 'function'){
			bp[key] = newKey(params);
		}else if(newKey.charAt(0)=='!')
			bp[key] = newKey.substring(1);
		else
			bp[key]=map[params[key]];
	}
	return bp;
}

function gcx(w,h,r){
	var l=(screen.width-w)/2;
	var t=(screen.height-h)/2;
	r=r ? 1 : 0;
	return 'toolbar=0,scrollbars=0,location=0,status=1,menubar=0,resizable='+r+',width='+w+',height='+h+',left='+l+',top='+t;
}

function openPopup(url,name,x,y,r){
	var wh=window.open(url,name,gcx(x,y,r));
	if(!wh) Ext.Msg.alert(getLocMsg('js_bilgi'), getLocMsg('js_once_popup_engel_kaldir')); else wh.focus();
	return false;
}

function grid2grid(gridMaster,gridDetail,params, tp){//tabpanel
	gridDetail.store.baseParams = null;
	if(params)gridDetail._params=params;
	gridMaster.getSelectionModel().on("selectionchange",function(a,b,c){
		if(!gridDetail.initialConfig.onlyCommitBtn && gridDetail.initialConfig.editMode)gridDetail.btnEditMode.toggle();
		if(a.hasSelection()){
			if(params || gridDetail._baseParams){
				gridDetail.store.baseParams=Ext.apply(gridDetail._baseParams||{},params ? buildParams(params, a.getSelected().data) :{});
			}
			if(gridDetail.isVisible() && (!tp || tp.isVisible())){
				if(gridDetail.initialConfig.master_column_id)gridDetail.store.load({add:false,params:gridDetail.store.baseParams,scope:gridDetail.store}); 
				else {
					if(gridDetail.pageSize)gridDetail.store.reload({add:false,params:gridDetail.store.baseParams,scope:gridDetail.store});
					else gridDetail.store.reload(); //Eğer burada hata olursa geri aç 24.06.2013
				}
				
				//else gridDetail.store.reload({add:false,params:gridDetail.store.baseParams,scope:gridDetail.store});
			} else 
				gridDetail.loadOnShow=true;
		} else {
			gridDetail.store.baseParams = null;
			gridDetail.store.removeAll();
		}
	}); 
	
	if(gridDetail.initialConfig.extraOutMap && gridDetail.initialConfig.extraOutMap.revMstTableId){
		var zz = gridDetail.initialConfig; 
		gridDetail.store.on("load",function(ax,bx,cx){
			if(!zz._revDf)return;
			zz._revDf.setValue("-");
			if(ax.reader && ax.reader.jsonData && ax.reader.jsonData.extraOutMap){
				var aq=ax.reader.jsonData.extraOutMap;
				var str=aq.revision_dsc || '-';
				str = str.substring(0,17); 
				//if(aq.dirty)str='<b style="color:red">'+str+'</b>';
				zz._revDf.setValue(str);
			}
		});
	}
	
	if(!tp){
		gridDetail.on("show",function(a,b,c){
			if(!a.initialConfig.onlyCommitBtn && a.initialConfig.editMode)a.btnEditMode.toggle();
			if(a.store.baseParams){
				if(a.initialConfig.master_column_id)a.store.load({add:false,params:a.store.baseParams,scope:a.store}); 
				else {
					if(a.pageSize)a.store.reload({add:false,params:a.store.baseParams,scope:a.store});
					else a.store.reload(); //Eğer burada hata olursa geri aç 24.06.2013
				}
			}
		});
	} else {
		tp._grid=gridDetail;
		tp.on("show",function(ax,b,c){
			var a=ax._grid;
			if(!a.initialConfig.onlyCommitBtn && a.initialConfig.editMode)a.btnEditMode.toggle();
			if(a.store.baseParams){
				if(a.initialConfig.master_column_id)a.store.load({add:false,params:a.store.baseParams,scope:a.store}); 
				else {
					if(a.pageSize)a.store.reload({add:false,params:a.store.baseParams,scope:a.store});
					else a.store.reload(); //Eğer burada hata olursa geri aç 24.06.2013				}
				}
			}
		});
	}
}

var searchFormTools=[{
	id: 'save',
	handler: function(ev, tb, sf) {//event, toolbar, searchForm
		if (!sf._menu) {
			var buttons=[{
	            text: getLocMsg('js_bu_ayarlari_kaydet'),
	            iconCls: 'icon-ekle',
	            handler: function(a, b, c) {
	                var p = prompt('Template Name', '');
	                if (p) {
	                    var params = sf.getForm().getValues();
	                    params._dsc = p;
	                    promisRequest({
	                        url: 'ajaxBookmarkForm?_fid=' + sf._formId,
	                        params: params,
	                        successCallback: function() {
	                            sf._menu = false;
	                            alert('saved');
	                        }
	                    });
	                }
	            }
	        },{
	            text: getLocMsg('js_kaydedilenleri_duzenle'),
	            iconCls: 'icon-duzenle',
	            handler: function(a, b, c) {
	                mainPanel.loadTab({
	                    attributes: {
	                        _title_: 'Search Form',
	                        modalWindow: true,
	                        href: 'showPage?_tid=259&_gid1=491',
	                        _pk: {
	                            tform_value_id: 'form_value_id'
	                        },
	                        baseParams: {
	                            xform_id: sf._formId
	                        }
	                    }
	                })
	            }
	        }];
	        promisRequest({
                url: 'ajaxQueryData?_qid=483',
                params: {
                    xform_id: sf._formId
                },
                successCallback: function(j) {
                    if (j.success && j.data.length > 0) {
//                        while (a_menu.items.items.length > 2) a_menu.remove(2);
                        buttons.push('-');
                        var pf = true;
                        for (var q = 0; q < j.data.length; q++) {
                            if (j.data[q].public_flag && pf) {
                                if (q > 0) buttons.push('-');
                                pf = false;
                            }
                            buttons.push({
                                text: j.data[q].dsc,
                                _id: j.data[q].form_value_id,
                                handler: function(a, b, c) {
                                    promisRequest({
                                        url: 'ajaxQueryData?_qid=503',
                                        params: {
                                            xform_value_id: a._id
                                        },
                                        successCallback: function(j2) {
                                            if (j2.success && j2.data.length > 0) {
                                                var f2 = sf.getForm()
                                                var j3 = {}
                                                for (var q2 = 0; q2 < j2.data.length; q2++) {
                                                    j3[j2.data[q2].dsc] = j2.data[q2].val
                                                }
                                                f2.setValues(j3)
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    }
                    sf._menu= new Ext.menu.Menu({enableScrolling:false, items:buttons});
                    sf._menu.showAt(ev.getXY());
                }
            });
        } else sf._menu.showAt(ev.getXY());
	}
}];

function fnShowDetailDialog(a,b){
	/*
	 * TODO memory leak olabilir.
	 */
	var sel = a._grid.sm.getSelected(),dv;
	new Ext.Window({
		title: '',
		id: 'grid_detail_dialog_id',
		width: 900, height: 600, autoScroll: true,  
		fbar: [{  
		     text: getLocMsg('kapat'),  
		     handler: function(){  
		       Ext.getCmp('grid_detail_dialog_id').close();  
		     }  
		   }] ,
		items: [
			dv=new Ext.DataView({
				store: new Ext.data.JsonStore({
					fields: a._grid.ds.reader.meta.fields,
					root: 'data'
				}),
				tpl:a._grid.detailView,
				autoScroll:true,
				itemSelector:'table.mva-detail'
			})
		]
	}).show();			
	dv.store.loadData({data:[sel.json]});
}

function showBulletinDetail(bulletinid){
	mainPanel.loadTab({attributes:{href:'showForm?_fid=1554&a=1&tbulletin_id='+bulletinid+'&sv_btn_visible=0'}});
	return false;
}

function fnClearFilters(a,b){
	a._grid._gp.filters.clearFilters();
} 

function fnTableImport(a,b){
	var im=a.ximport || a._grid.crudFlags.ximport;
	if(typeof im=='boolean'){
		Ext.Msg.alert(getLocMsg('js_bilgi'), getLocMsg('js_table_import_setting_error'));
		return
	}
	
	var cfg={attributes:{modalWindow:true,id:'git'+a._grid.id,_title_:a._grid.name,
		href:'showPage?_tid=178&_gid1=895&xmaster_table_id='+im.xmaster_table_id+'&xtable_id='+a._grid.crudTableId+(im.xobject_tip ? '&xobject_tip='+im.xobject_tip:''), _grid:a._grid, ximport:im}};
	mainPanel.loadTab(cfg);
}

function showTableChildList(e, vtip, vxid, mtid, mtpk, relId){
	if (typeof e == 'undefined' && window.event) { e = window.event; }
	var elx=Ext.get("idLinkRel_"+relId);
	promisRequest({url:'ajaxGetTableRelationData',params:{_tb_id:mtid, _tb_pk:mtpk, _rel_id:relId}, successCallback:function(j){
			var items=[];
			for(var qi=0;qi<j.data.length;qi++)items.push({text:(j.data[qi].dsc.length>100 ? j.data[qi].dsc.substring(0,97)+'...':j.data[qi].dsc), _id: j.data[qi].id, handler:function(ax){fnTblRecEdit(j.queryId,ax._id);}});
			if(j.browseInfo.totalCount>j.browseInfo.fetchCount){
				items.push('-');
				items.push({text:getLocMsg('js_more')+'....(Total '+j.browseInfo.totalCount+')', handler:function(){alert('yakinda')}});// TODO
			}
			new Ext.menu.Menu({enableScrolling:false, items:items}).showAt([elx.getX()+16, elx.getY()+16]);
		}
	})
	return false;
}

var recordInfoWindow = null;
function renderTableRecordInfo(j){
	if(!j || !j.dsc)return false;
	var s='<p>';if(j.profile_picture_id)s+=Ext.util.Format.getPic3Mini(j)+' &nbsp;';
	s+='<a href=# style="font-size:16px;color:green" onclick="return fnTblRecEdit('+j.tableId+','+j.tablePk+', true);">'+j.dsc+'</a></p><table border=0 width=100%><tr><td width=70% valign=top>';
	if(j.commentFlag && j.commentCount>0)s+=' &nbsp; <img src="../images/custom/comments.png" title="Yorumlar"> '+(j.commentCount);
	if(j.fileAttachFlag && j.fileAttachCount>0)s+=' &nbsp; <img src="../images/custom/crm/attachment.gif" title="İlişkili Dosyalar"> '+(j.fileAttachCount);
	if(j.accessControlFlag && j.accessControlCount>0)s+=' &nbsp; <img src="../images/custom/record_security.png" title="Kayıt Bazlı Güvenlik"> '+(j.accessControlCount);
	if(j.keywords && j.keywords.length>0)s+=' &nbsp; <img src="../images/custom/keyword.png" title="Anahtar Kelimeler"> '+j.keywords;
//	if(j.relationFlag && j.relationCount>0)s+='&nbsp; <img src="../images/custom/record_security.png" title="İlişkili Kayıtlar"> '+(j.relationCount>0 ? j.relationCount:'');
	s+='</td><td width=30% align=right valign=top>';
	if(j.formSmsMailCount)s+=' &nbsp; <img src="../images/famfam/email.png" title="EPosta/SMS Dönüşümleri"> '+j.formSmsMailCount;
	if(j.conversionCount)s+=' &nbsp; <img src="../images/famfam/cog.png" title="Form Dönüşümleri"> '+j.conversionCount;
	s+='</td></tr></table><hr>';
	var rs=j.parents;
	var ss='';
    for(var qi=rs.length-1;qi>=0;qi--){
        var r=rs[qi];
        if(qi!=rs.length-1)ss+='<br>';
        for(var zi=rs.length-1;zi>qi;zi--)ss+=' &nbsp; &nbsp;';
        ss+='&gt '+(qi!=0 ? (r.tdsc) : ('<b>'+r.tdsc+'</b>'));
        if(r.dsc){
        	var rdsc=r.dsc;if(rdsc.length>300)rdsc=rdsc.substring(0,297)+'...';
        	ss+=(qi!=0 ? ': <a href=# onclick="return fnTblRecEdit('+r.tid+','+r.tpk+', false);">'+rdsc+'</a>':': '+rdsc);// else ss+=': (...)';
        }
    }
    ss = '<div class="dfeed">'+ss+'</div>';
/*    rs=j.parents[0];
    if(typeof rs.tcc!='undefined')ss+=' · ' + ('<a href=# onclick="return fnTblRecComment('+j.tableId+','+j.tablePk+');">'+(!rs.tcc ? 'Yorum Yap':('Yorumlar ('+rs.tcc+')'))+'</a>')
    if(typeof rs.tfc!='undefined')ss+=' · ' + ('<a href=# onclick="return fnNewFileAttachment4Form('+j.tableId+','+j.tablePk+');">'+(!rs.tfc ? 'İlişkili Dosyalar':('İlişkili Dosyalar ('+rs.tfc+')'))+'</a>')
  */  	
    s+=ss+'<p><br>';
    if(j.insert_user_id){
    	s+='<span class="cfeed"> · <a href=# onclick="return openChatWindow('+j.insert_user_id+',\''+j.insert_user_id_qw_+'\',true)">'+j.insert_user_id_qw_+'</a> tarafindan '+j.insert_dttm+' tarihinde kayıt yapılmış';
    	if(j.version_no && j.version_no>1)s+='<br> · <a href=# onclick="return openChatWindow('+j.version_user_id+',\''+j.version_user_id_qw_+'\',true)">'+j.version_user_id_qw_+'</a> tarafindan '+j.version_dttm+' tarihinde son kez değiştirilmiş <br> · toplam '+j.version_no+' kere değiştirilmiş</span><p>'
    }
    	
    rs=j.childs;
    if(!rs || !rs.length)return s;
	ss='<br><b>Alt kırılımlar</b>';
    for(var qi=0;qi<rs.length;qi++){
        var r=rs[qi];
        ss+='<br> · '+ (r.vtip ? '<a href=# id="idLinkRel_'+r.rel_id+'" onclick="return showTableChildList(event,'+r.vtip+','+r.void+','+r.mtbid+','+r.mtbpk+','+r.rel_id+');return false;">'+r.tdsc +'</a>': r.dsc) + ' ('+r.tc + (_app.table_children_max_record_number && 1*r.tc==1*_app.table_children_max_record_number-1 ? '+':'')+' adet)';
    	if(r.tcc)ss+=' &nbsp; <img src="../images/custom/comments.png" title="Yorumlar"> '+(r.tcc);
    	if(r.tfc)ss+=' &nbsp; <img src="../images/custom/crm/attachment.gif" title="İlişkili Dosyalar"> '+(r.tfc);

//        if(r.dsc)ss+=(qi!=0 ? ': '+r.dsc:': <b>'+r.dsc+'</b>');// else ss+=': (...)';
    }
    return s+ss;    	
}


function fnTblRecEdit(tid,tpk,b){
	if(b){
		if(recordInfoWindow && recordInfoWindow.isVisible()){recordInfoWindow.destroy();recordInfoWindow=null;}
		mainPanel.loadTab({attributes:{id:'g-'+tid+'-'+tpk,href:'showForm?_tb_id='+tid+'&_tb_pk='+tpk}});
	} else {
		promisRequest({url:'getTableRecordInfo',params:{_tb_id:tid, _tb_pk:tpk}, successCallback:function(j){
				if(j.dsc){
					if(j.dsc.length>100)j.dsc=j.dsc.substring(0,97)+'...';
					if(recordInfoWindow && recordInfoWindow.isVisible()){
//						recordInfoWindow.destroy();
						recordInfoWindow.update(renderTableRecordInfo(j));
						recordInfoWindow.setTitle(j.parents[0].tdsc);
						recordInfoWindow.setIconClass('icon-folder-explorer');
					} else {
						recordInfoWindow = new Ext.Window({
			        		modal:true, shadow:false,
			        		title:j.parents[0].tdsc,
			        		width: 500, 
			        		autoHeight:true, bodyStyle:'padding:3px;background-color:#FFF',
			        		iconCls:'icon-folder-explorer',
			        		border: false, html: renderTableRecordInfo(j)});
						recordInfoWindow.show();
					}
				} else alert('hata.. geri don')
			}
		})
	}
	return false;
}


function fnOpenUrl(url){
	mainPanel.loadTab({attributes:{href:url}});
	return false;
}

function fnTblRecComment(tid,tpk){
	mainPanel.loadTab({attributes:{modalWindow:true, href:'showPage?_tid=836',slideIn:'t',_pk:{tcomment_id:'comment_id'},baseParams:{xtable_id:tid, xtable_pk:tpk}}});
	return false;
}

function fnTblRecPicture(tid,tpk){
	alert('fnTblRecPicture');
	//mainPanel.loadTab({attributes:{modalWindow:true, href:'showPage?_tid=238&_gid1=457',_pk:{tcomment_id:'comment_id'},baseParams:{xtable_id:tid, xtable_pk:tpk}}});
	return false;
}
function fnRowBulkEdit(a,b){
	mainPanel.loadTab({attributes:{id:'gu-'+a._grid.id,href:'showForm?_fid=1617&xtable_id='+a._grid.crudTableId, _grid:a._grid}});
}

function fnRowBulkMail(a,b){
	mainPanel.loadTab({attributes:{id:'gum-'+a._grid.id,href:'showForm?_fid=2128&xtable_id='+a._grid.crudTableId, _grid:a._grid}});
}

function fnRowEdit(a,b){
    if(!a._grid.onlyCommitBtn && a._grid.editMode){
    	Ext.Msg.alert(getLocMsg('js_bilgi'), getLocMsg('js_yazma_modundan_cikmalisiniz'));
    	return;
    }
    if(!a._grid.sm.hasSelection()){
    	Ext.Msg.alert(getLocMsg('js_bilgi'),getLocMsg('js_once_birseyler_secmelisiniz'));
    	return
    }
    
    if(a._grid.multiSelect){
    }
  	var sel = a._grid.sm.getSelected();
  	var href='showForm?'+(_request._dev && 1*_request._dev ? '_dev=1&':'')+'a=1&_fid='+a._grid.crudFormId;
  	var idz='';
	for(var key in a._grid._pk){
		href+="&"+key+"="+sel.data[a._grid._pk[key]];
		idz+=sel.data[a._grid._pk[key]];
	}
  	if(typeof a._grid._postUpdate == 'function'){
  		href = a._grid._postUpdate(sel,href,a); // null donerse acilmayacak
  	} else {
    	if(a._grid._postUpdate)href+="&"+a._grid._postUpdate;
  	}
	if(href){
		var cfg={attributes:{id:'g'+a._grid.id+'-'+idz,href:href, _grid:a._grid ? (a._grid._refreshGrid || a._grid): null}};
		if(a.showModalWindowFlag)cfg.attributes.modalWindow=true;
		mainPanel.loadTab(cfg);
	}
};

function fnRowEdit4Log(a,b){
    if(!a._grid.sm.hasSelection()){
    	Ext.Msg.alert(getLocMsg('js_bilgi'),getLocMsg('js_once_birseyler_secmelisiniz'));
    	return
    }
  	var sel = a._grid.sm.getSelected();
  	var href='showForm?a=1&_fid='+a._cgrid.crudFormId+'&_log5_log_id='+sel.data.log5_log_id;
  	var idz='';
  	var _pk=a._cgrid._pk;
	for(var key in _pk){
		href+="&"+key+"="+sel.data[_pk[key]];
		idz+=sel.data[_pk[key]];
	}
  	if(typeof a._grid._postUpdate == 'function'){
  		href = a._grid._postUpdate(sel,href,a); // null donerse acilmayacak
  	} else {
    	if(a._grid._postUpdate)href+="&"+a._grid._postUpdate;
  	}
	if(href){
		var cfg={attributes:{modalWindow:true,id:'g'+a._grid.id+'-'+idz,href:href, _grid:a._cgrid}};
		mainPanel.loadTab(cfg);
	}
};

function fnDataMoveUpDown(a,b){
    if(!a._grid.onlyCommitBtn && a._grid.editMode){
    	Ext.Msg.alert(getLocMsg('js_bilgi'),getLocMsg('js_yazma_modundan_cikmalisiniz'));
    	return;
    }
    
	var sel = a._grid.sm.getSelected();
	promisRequest({url:'ajaxExecDbFunc?_did=701&ptable_id='+a._grid.crudTableId+'&ptable_pk='+sel.id+'&pdirection='+a._direction, successDs: a._grid.ds});
}

function fnRowEditDblClick(a,b){
	fnRowEdit({_grid:a.initialConfig},b)
}

function fnRowInsert(a,b){
    if(!a._grid.onlyCommitBtn && a._grid.editMode){
    	Ext.Msg.alert(getLocMsg('js_bilgi'),getLocMsg('js_yazma_modundan_cikmalisiniz'));
    	return;
    }
  	var sel = a._grid.sm.getSelected();
  	var href='showForm?'+(_request._dev && 1*_request._dev ? '_dev=1&':'')+'a=2&_fid='+a._grid.crudFormId;
  	if(typeof a._grid._postInsert == 'function'){
  		href = a._grid._postInsert(sel,href,a); // null donerse acilmayacak
  	} else {
    	if(a._grid._postInsert)href+="&"+a._grid._postInsert;
  	}
	if(href){
		var cfg={attributes:{id:'g'+a._grid.id+'-i',href:href, _grid:a._grid ? (a._grid._refreshGrid || a._grid): null}};
		if(a.showModalWindowFlag)cfg.attributes.modalWindow=true;
		mainPanel.loadTab(cfg);
	}
};
function fnRowCopy(a,b){
    if(!a._grid.sm.hasSelection()){
    	Ext.Msg.alert(getLocMsg('js_bilgi'),getLocMsg('js_once_birseyler_secmelisiniz'));
    	return
    }
    
    if(a._grid.multiSelect){
    }
  	var sel = a._grid.sm.getSelected();
  	var href='showForm?a=5&_fid='+a._grid.crudFormId;
  	var idz='';
	for(var key in a._grid._pk){
		href+="&"+key+"="+sel.data[a._grid._pk[key]];
		idz+=sel.data[a._grid._pk[key]];
	}
  	if(typeof a._grid._postInsert == 'function'){
  		href = a._grid._postInsert(sel,href,a); // null donerse acilmayacak
  	} else {
    	if(a._grid._postInsert)href+="&"+a._grid._postInsert;
  	}
	if(href){
		var cfg={attributes:{id:'gc'+a._grid.id+'-'+idz,href:href, _grid:a._grid}};
		if(a.showModalWindowFlag)cfg.attributes.modalWindow=true;
		mainPanel.loadTab(cfg);
	}
}
function fnRowDelete(a,b){
    if(!a._grid.sm.hasSelection()){
    	Ext.Msg.alert(getLocMsg('js_bilgi'),getLocMsg('js_once_birseyler_secmelisiniz'));
    	return
    }
    if(a._grid.multiSelect){
    	var sels=a._grid.sm.getSelections();
	    if(a._grid.editMode){
	    	var sel=null;
	    	for(var zz=0;zz<sels.length;zz++){
	    		sel=sels[zz];
		    	var delItem={};
		    	for(var key in a._grid._pk)delItem[key]=sel.data[a._grid._pk[key]];
		    	a._grid._deletedItems.push(delItem);
		    	a._grid.ds.remove(sel);
		    }
	    	var ds=a._grid.ds || a._grid.store;
	    	var io=ds.indexOf(sel);
	    	ds.remove(sel);
	    	if(ds.getCount()>0){
	    		if(io>=ds.getCount())io=ds.getCount()-1;
	    		a._grid.sm.selectRow(io,false);
	    	}
	    	return;
	    }
	    
	    Ext.MessageBox.confirm(getLocMsg('js_warning'), getLocMsg('js_secili_kayitlari_silmek_emin')+' ('+sels.length+' '+getLocMsg('js_kayit')+')', function(btn){
	        if(btn == 'yes'){
		    	var href='ajaxPostEditGrid?_fid='+a._grid.crudFormId;
		    	var params={_cnt:sels.length};
		    	if(typeof a._grid._postDelete == 'function'){
		      		href = a._grid._postDelete(sels,href,a); // null donerse acilmayacak
		      	}else{
			      	for(var bjk=0;bjk<sels.length;bjk++){ // delete
			      		for(var key in a._grid._pk)params[key+""+(bjk+1)]=sels[bjk].data[a._grid._pk[key]];
			      		params["a"+(bjk+1)]=3;
			      	}
		      	}
		    	if(href)promisRequest({
					url: href,
					params:params,
					successDs: a._grid.ds,
					successCallback:function(j2){
		    			if(j2.logErrors || j2.msgs){
		                	var str='';
		                	if(j2.msgs)str=j2.msgs.join('<br>')+'<p>';
		                	if(j2.logErrors)str+=prepareLogErrors(j2);
		                	Ext.Msg.show({title: getLocMsg('js_bilgi'),msg: str,icon: Ext.MessageBox.INFO});
		    			}
		    		}
		    	});
	        }
	    });
    } else {
	    var sel=a._grid.sm.getSelected();
	    if(a._grid.onlyCommitBtn || a._grid.editMode){
	    	var delItem={};
	    	for(var key in a._grid._pk)delItem[key]=sel.data[a._grid._pk[key]];
	    	if(!a._grid._deletedItems)a._grid._deletedItems=[];
	    	a._grid._deletedItems.push(delItem);
	    	var ds=a._grid.ds || a._grid.store;
	    	var io=ds.indexOf(sel);
	    	ds.remove(sel);
	    	if(ds.getCount()>0){
	    		if(io>=ds.getCount())io=ds.getCount()-1;
	    		a._grid.sm.selectRow(io,false);
	    	}
	    	return;
	    }
	    Ext.MessageBox.confirm(getLocMsg('js_warning'), getLocMsg('js_secili_kayit_silmek_emin'), function(btn){
	        if(btn == 'yes'){
		    	var href='ajaxPostForm?a=3&_fid='+a._grid.crudFormId;
		    	if(typeof a._grid._postDelete == 'function'){
		      		href = a._grid._postDelete(sel,href,a); // null donerse acilmayacak
		      	} else {
			    	for(var key in a._grid._pk)href+="&"+key+"="+sel.data[a._grid._pk[key]];
			    	if(a._grid._postDelete)href+="&"+a._grid._postDelete;
		      	}
		    	if(href)promisRequest({
					url: href,
					successDs: a._grid.ds,
					successCallback:function(j2){
						if(!j2.logErrors){a._grid.ds.remove(sel);}
		    			if(j2.logErrors || j2.msgs){
		                	var str='';
		                	if(j2.msgs)str=j2.msgs.join('<br>')+'<p>';
		                	if(j2.logErrors)str+=prepareLogErrors(j2);
		                	Ext.Msg.show({title: getLocMsg('js_bilgi'),msg: str,icon: Ext.MessageBox.INFO});
		    			}
		    		}
		    	});
	        }
	    });
    }
};

function fnRightClick(grid, rowIndex, e){
	e.stopEvent();
	grid.getSelectionModel().selectRow(rowIndex);
	var coords = e.getXY();
	grid.messageContextMenu.showAt([coords[0], coords[1]]);
}

function selections2string(selections,seperator){
	if(!selections)return '';
	if(!seperator)seperator='|';
	var str='';
	for(var d=0;d<selections.length;d++)str+=seperator+selections[d].id;
	return str.substring(1);
}

function fnExportGridData(b){
	return function(a){
	    var g=a._grid;
	    if(g.ds.getTotalCount()==0){
	    	Ext.Msg.alert(getLocMsg('js_bilgi'),getLocMsg('js_no_data'));
	    	return
	    }
	    var cols='';
	    for(var z=0;z<g.columns.length;z++){
	    	if((!g.columns[z].hidden) && (g.columns[z].dataIndex))cols+=';'+g.columns[z].dataIndex+','+g.columns[z].width;
	    }
	    var url='grd/'+g.name+'.'+b+'?_gid='+g.gridId+'&_columns='+cols.substr(1);
	    var vals=g.ds.baseParams;
	    for(var k in vals)url+='&'+k+'='+vals[k];
	    if(g.ds.sortInfo){
	    	if(g.ds.sortInfo.field)url+='&sort='+g.ds.sortInfo.field;
	    	if(g.ds.sortInfo.direction)url+='&dir='+g.ds.sortInfo.direction;
	    }
	    openPopup(url,'_blank',800,600);
	};
}

function fnGraphGridData(a){
	var g=a._grid;
	if(g.ds.getTotalCount()==0){
		Ext.Msg.alert(getLocMsg('js_bilgi'),getLocMsg('js_no_data'));
		return
	}
	mainPanel.loadTab({attributes:{href:'showPage?_tid=480&tgrid_id='+g.gridId, _grid:g}});
}

function fnGraphGridDataTree(a){
	var g=a._grid;
	if(g.ds.getTotalCount()==0){
		Ext.Msg.alert(getLocMsg('js_bilgi'),getLocMsg('js_no_data'));
		return
	}
	mainPanel.loadTab({attributes:{href:'showPage?_tid=481&xgrid_id='+g.gridId+'&xtable_id='+g.crudTableId, _grid:g}});
}

function fnExportGridDataWithDetail(b){
	return function(a){
	    var g2=a._grid;
	    if(!g2 || !g2._masterGrid){return false;}
	    var g=g2._masterGrid;
	    var params = g2._gp._params;
	    if(!params){return false;}
	    if(g.ds.getTotalCount()==0){
	    	Ext.Msg.alert(getLocMsg('js_bilgi'),getLocMsg('js_no_data'));
	    	return
	    }
	    var cols='';
	    for(var z=0;z<g.columns.length;z++){ //master
	    	if((!g.columns[z].hidden) && (g.columns[z].dataIndex))cols+=';'+g.columns[z].dataIndex+','+g.columns[z].width;
	    }
	    var cols2='';
	    for(var z=0;z<g2.columns.length;z++){ //detail
	    	if((!g2.columns[z].hidden) && (g2.columns[z].dataIndex))cols2+=';'+g2.columns[z].dataIndex+','+g2.columns[z].width;
	    }
	    var par2 = '';
	    for(var z in params){
	    	if(params[z])par2+=';'+z+','+params[z];
	    }
	    var url='grd2/'+g.name+'.'+b+'?_gid='+g.gridId+'&_columns='+cols.substr(1)+'&_gid2='+g2.gridId+'&_columns2='+cols2.substr(1)+'&_params='+par2.substr(1);
	    var vals=g.ds.baseParams;
	    for(var k in vals)url+='&'+k+'='+vals[k];
	    if(g.ds.sortInfo){
	    	if(g.ds.sortInfo.field)url+='&sort='+g.ds.sortInfo.field;
	    	if(g.ds.sortInfo.direction)url+='&dir='+g.ds.sortInfo.direction;
	    }
	    openPopup(url,'_blank',800,600);
	};
}

function fnNewFileAttachmentMail(a){
	var fp = a._form._cfg.formPanel;
	var hasReqestedVersion = true;
	/*var hasReqestedVersion = DetectFlashVer(9, 0, 0); // Bu flash yüklü mü değil mi onu sorguluyor. (major ver, minor ver, revision no)*/
   	if(hasReqestedVersion){
   		var href='showForm?_fid=750&_did=447&table_id=48&table_pk=-1';
   	}
   	else{
   		var href='showForm?a=2&_fid=512&table_id='+a._grid.crudTableId+'&table_pk='+table_pk.substring(1);
   	}
  	mainPanel.loadTab({attributes:{modalWindow:true, id:a._form.formId+'f',href:href, _form: fp, iconCls:'icon-attachment', title:'Dosya Ekle'}});
}

function fnNewFileAttachment(a){
	var hasReqestedVersion = DetectFlashVer(9, 0, 0); // Bu flash yüklü mü değil mi onu sorguluyor. (major ver, minor ver, revision no)
  	var sel = a._grid.sm.getSelected();
    if(!sel){
    	Ext.Msg.alert(getLocMsg('js_bilgi'),getLocMsg('js_once_birseyler_secmelisiniz'));
    	return
    }
    var image_param="";
    if (a.not_image_flag){
    	image_param = "&xnot_image_flag=1";
    }
  	var table_pk='';
   	for(var key in a._grid._pk)table_pk+="|"+sel.data[a._grid._pk[key]];
   	if(hasReqestedVersion && (a._grid.gridId*1 != 1082)){ // Acente/Bayi logolarının eklenmesi biraz farklı
   		var href='showForm?_fid=714&_did=447&table_id='+a._grid.crudTableId+'&table_pk='+table_pk.substring(1) + image_param;
   	}
   	else{
   		var href='showForm?a=2&_fid=43&table_id='+a._grid.crudTableId+'&table_pk='+table_pk.substring(1)+ image_param;
   	}
  	mainPanel.loadTab({attributes:{modalWindow:true, id:a._grid.id+'f',href:href, _grid:a._grid, iconCls:'icon-attachment', title:a._grid.name}});
}

function fnNewFileAttachment4ExternalUrl(a){
  	var sel = a._grid.sm.getSelected();
    if(!sel){
    	Ext.Msg.alert(getLocMsg('js_bilgi'),getLocMsg('js_once_birseyler_secmelisiniz'));
    	return
    }
  	var table_pk='';
   	for(var key in a._grid._pk)table_pk+="|"+sel.data[a._grid._pk[key]];

   	
   	var href = 'showForm?a=2&_fid=2213&table_id='+a._grid.crudTableId+'&table_pk='+table_pk.substring(1);
   	
  	mainPanel.loadTab({attributes:{modalWindow:true, id:a._grid.id+'f',href:href, _grid:a._grid, iconCls:'icon-attachment', title:getLocMsg('js_add_from_external_url')}});
}

function fnNewFileAttachment4Form(tid,tpk,not_image_flag){
	var hasReqestedVersion = DetectFlashVer(9, 0, 0); // Bu flash yüklü mü değil mi onu sorguluyor. (major ver, minor ver, revision no)
	var image_param="";
    if (not_image_flag){
    	image_param = "&xnot_image_flag=1";
    }
   	if(hasReqestedVersion){ // Acente/Bayi logolarının eklenmesi biraz farklı
   		var href='showForm?_fid=714&_did=447&table_id='+tid+'&table_pk='+tpk+ image_param;
   	}
   	else{
   		var href='showForm?a=2&_fid=43&table_id='+tid+'&table_pk='+tpk+ image_param;
   	}
  	mainPanel.loadTab({attributes:{modalWindow:true, id:tid+'xf',href:href, iconCls:'icon-attachment', title:'Dosya Ekle'}});
  	return false;
}

function fnFileAttachmentList(a){
  	var sel = a._grid.sm.getSelected();
    if(!sel){
    	Ext.Msg.alert(getLocMsg('js_bilgi'),getLocMsg('js_once_birseyler_secmelisiniz'));
    	return
    }
  	var table_pk='';
   	for(var key in a._grid._pk)table_pk+="|"+sel.data[a._grid._pk[key]];
	var cfg={attributes:{modalWindow:true, href:'showPage?_tid=518&_gid1=458&_gid458_a=1',_pk:{tfile_attachment_id:'file_attachment_id'},baseParams:{xtable_id:a._grid.crudTableId, xtable_pk:table_pk.substring(1)}}};
	cfg.attributes._title_=(sel.data.dsc ? a._grid.name+': '+sel.data.dsc : a._grid.name);
	mainPanel.loadTab(cfg);
}

function fnCommit(a){
	var params={};
  	var dirtyCount=0;
	if(a._grid.fnCommit){
		params=a._grid.fnCommit(a._grid);
		if(!params)return;
		dirtyCount=params._cnt;
	} else {
	  	var items = a._grid._deletedItems;
	  	if(items)for(var bjk=0;bjk<items.length;bjk++){ // delete
	  		dirtyCount++;
	  		for(var key in items[bjk])params[key+""+dirtyCount]=items[bjk][key];
	  		params["a"+dirtyCount]=3;
	  	}
	  	
	  	items = a._grid.ds.data.items;
	  	if(items)for(var bjk=0;bjk<items.length;bjk++)if(items[bjk].dirty){ // edit
	  		if(a._grid.editGridValidation){
	  			if(a._grid.editGridValidation(items[bjk])===false)return;
	  		}
	  		dirtyCount++;
	
	  		var changes=items[bjk].getChanges();
	  		for(var key in changes){
	  			var valx = changes[key];
	  			params[key+""+dirtyCount]= valx!=null ? (valx instanceof Date ? fmtDateTime(valx):valx) : null;
	  		}
			if(a._grid._insertedItems && a._grid._insertedItems[items[bjk].id]){
				params["a"+dirtyCount]=2;
				if(a._grid._postInsertParams){
					var xparams=null;
					if(typeof a._grid._postInsertParams=='function')xparams=a._grid._postInsertParams(items[bjk]);
					else xparams=a._grid._postInsertParams;
					if(xparams)for(var key in xparams)params[key+dirtyCount]=xparams[key];
				}
			} else {
		  		for(var key in a._grid._pk){
		  			var val=a._grid._pk[key];
		  			params[key+""+dirtyCount]=(val.charAt(0)=='!') ? val.substring(1):items[bjk].data[val];
		  		}
				params["a"+dirtyCount]=1;
			}
	  	}
	}
  	if(dirtyCount>0){
  		params._cnt=dirtyCount;  		
  		Ext.MessageBox.confirm(getLocMsg('js_warning'), getLocMsg('js_degisiklik_kayit_emin'), function(btn){
	        if(btn == 'yes'){
	      		promisRequest({
	    			url:'ajaxPostEditGrid?_fid='+a._grid.crudFormId,
	    			params:params,
	    			successDs: a._grid.ds,
	    			successCallback:function(j2){
		      			if(a._grid._deletedItems)a._grid._deletedItems=[];
		      			if(a._grid._insertedItems)a._grid._insertedItems=[];
		    			if(j2.logErrors || j2.msgs){
		                	var str='';
		                	if(j2.msgs)str=j2.msgs.join('<br>')+'<p>';
		                	if(j2.logErrors)str+=prepareLogErrors(j2);
		                	Ext.Msg.show({title: getLocMsg('js_bilgi'),msg: str,icon: Ext.MessageBox.INFO});
		    			}
	      			}
	    		});
	        }
	    });
  	} else Ext.Msg.alert(getLocMsg('js_bilgi'),getLocMsg('js_degisiklik_yok'));
}


function fnToggleEditMode(a){	
	
	a._grid.editMode = !a._grid.editMode;
	
  	if(typeof a._grid._postToggleEditMode == 'function'){
  		if(a._grid.editMode && !a._grid._postToggleEditMode(a)){
  			a._grid._gp.btnEditMode.toggle();
  			return null;
  		}
  	}
  	
	if(a._grid.editMode){ // editMode'a geçti
		a._grid._deletedItems=[];
		if(a._grid._gp.btnCommit)a._grid._gp.btnCommit.enable();
	} else {
		if(a._grid._gp.btnCommit)a._grid._gp.btnCommit.disable();
		var modified = false;
		if(a._grid._deletedItems.length>0)modified=true;
		if(!modified){
			var items = a._grid.ds.data.items;
			for(var bjk=0;bjk<items.length;bjk++)if(items[bjk].dirty){modified=true;break;}
		}
		
		if(modified)a._grid.ds.reload();
	}
}

function fnGridSetting(a){
	var cfg=null
	if(a._grid.searchForm){
		cfg={attributes:{modalWindow:true, _width_:600, _height_:400, href:'showPage?_tid=543&_gid1=440&_gid3=439&_fid4=998&a=1&tform_id='+a._grid.searchForm.formId+'&_fid2=999&tgrid_id='+a._grid.gridId,_pk1:{tgrid_column_id:'grid_column_id'},_pk3:{tform_cell_id:'form_cell_id'},baseParams:{xgrid_id:a._grid.gridId,xform_id:a._grid.searchForm.formId}}};
	} else {
		cfg={attributes:{modalWindow:true, href:'showPage?_tid=543&_gid1=440&_fid2=999&a=1&tgrid_id='+a._grid.gridId,_pk1:{tgrid_column_id:'grid_column_id'},baseParams:{xgrid_id:a._grid.gridId}}};
	}
	cfg.attributes._title_= getLocMsg('js_mazgal_ayarlari')+' ('+a._grid.name+')';
	mainPanel.loadTab(cfg);
}

function fnGridReportSetting(a){
	if(!a._grid.crudTableId)return false;
	var cfg={attributes:{modalWindow:true, href:'showPage?_tid=238&_gid1=1626',_pk1:{treport_id:'report_id'},baseParams:{xmaster_table_id:a._grid.crudTableId}}};
	cfg.attributes._title_= a._grid.name;//getLocMsg('report_settings');
	mainPanel.loadTab(cfg);
}



function fnGridPrivilege(a){
	var url='showPage?_tid=543&_gid1=442';
	var attr={modalWindow:true,_pk1:{ttable_field_id:'table_field_id'},baseParams:{xgrid_id:a._grid.gridId,xobject_tip:5,xobject_id:a._grid.gridId},_title_:'Grid Yetkileri ('+a._grid.name+')'};
	var adet=1;
	if(a._grid.extraButtons && a._grid.extraButtons.length>0){
		adet++;
		url+='&_gid'+adet+'=838';
		attr['_pk'+adet]={ttoolbar_item_id:'toolbar_item_id'};
	}
	if(a._grid.menuButtons && a._grid.menuButtons.items.length>0){	
		adet++;
		url+='&_gid'+adet+'=839';
		attr['_pk'+adet]={tmenu_item_id:'menu_item_id'};
	}
	if(a._grid.isMainGrid){
		adet++;
		url+='&_gid'+adet+'=803';
		attr.baseParams.xparent_object_id=a._grid.extraOutMap.tplObjId;
		attr['_pk'+adet]={ttemplate_object_id:'template_object_id'};
	}
	attr.href=url;
	mainPanel.loadTab({attributes:attr});
}

function fnRecordComments(a){//TODO: daha duzgun bir chat interface'i yap
  	var sel = a._grid.sm.getSelected();
    if(!sel){
    	Ext.Msg.alert(getLocMsg('js_bilgi'),getLocMsg('js_once_birseyler_secmelisiniz'));
    	return
    }
  	var table_pk='';
   	for(var key in a._grid._pk)table_pk+="|"+sel.data[a._grid._pk[key]];
	var cfg={attributes:{modalWindow:true, href:'showPage?_tid=836',slideIn:'t',_pk:{tcomment_id:'comment_id'},baseParams:{xtable_id:a._grid.crudTableId, xtable_pk:table_pk.substring(1)}}};
	cfg.attributes._title_=(sel.data.dsc ? a._grid.name+': '+sel.data.dsc : a._grid.name);
	mainPanel.loadTab(cfg);
}

function fnRecordPictures(a){	
	var sel = a._grid.sm.getSelected();
    if(!sel){
    	Ext.Msg.alert(getLocMsg('js_bilgi'),getLocMsg('js_once_birseyler_secmelisiniz'));
    	return
    }
  	var table_pk='',table_id;
   	for(var key in a._grid._pk)table_pk+="|"+sel.data[a._grid._pk[key]];
   	table_pk=table_pk.substring(1);
   	table_id=a._grid.crudTableId;
  	var cfg={attributes:{modalWindow:true, href:'showPage?_tid=714&table_id='+table_id+'&table_pk='+table_pk,_pk:{tfile_attachment_id:'file_attachment_id'},baseParams:{xtable_id:table_id, xtable_pk:table_pk}}};
	cfg.attributes._title_=(sel.data.dsc ? a._grid.name+': '+sel.data.dsc : a._grid.name);
	mainPanel.loadTab(cfg);
}

function fnRecordConvertionLog(a){
  	var sel = a._grid.sm.getSelected();
    if(!sel){
    	Ext.Msg.alert(getLocMsg('js_bilgi'),getLocMsg('js_once_birseyler_secmelisiniz'));
    	return
    }
  	var table_pk='';
  	for(var key in a._grid._pk)table_pk+="|"+sel.data[a._grid._pk[key]]; 	
	var cfg={attributes:{modalWindow:true, href:'showPage?_tid=178&_gid1=1731', baseParams:{xsrc_table_id:a._grid.crudTableId, xsrc_table_pk:table_pk.substring(1)}}};
	cfg.attributes._title_=(sel.data.dsc ? a._grid.name+': '+sel.data.dsc : a._grid.name);
	mainPanel.loadTab(cfg);
}

function fnRecordKeywords(a){
  	var sel = a._grid.sm.getSelected();
    if(!sel){
    	Ext.Msg.alert(getLocMsg('js_bilgi'),getLocMsg('js_once_birseyler_secmelisiniz'));
    	return
    }
  	var table_pk='';
   	for(var key in a._grid._pk)table_pk+="|"+sel.data[a._grid._pk[key]];
  	var cfg={attributes:{modalWindow:true, href:'showPage?_tid=238&_gid1=54',_pk:{tkeyword_id:'keyword_id',ttable_id:'table_id',ttable_pk:'table_pk'},baseParams:{xtable_id:a._grid.crudTableId, xtable_pk:table_pk.substring(1)}}};
	cfg.attributes._title_=sel.data.dsc ? a._grid.name+': '+sel.data.dsc : a._grid.name;
	mainPanel.loadTab(cfg);
}

function fnSendMail(a){
	var sel=null,xtable_ids = null;
	
    if(a._grid.multiSelect){
    	xtable_ids = selections2string(a._grid.sm.getSelections(),',');
    	sel = a._grid.sm.getSelections()[0];
    	table_relation = '&_tableId='+a._grid.crudTableId+'&_tablePk='+a._grid.sm.getSelections()[0].data.id;// çoklu seçimde ilk kayıtla ilişkilendirilsin.
    } else {
    	sel = a._grid.sm.getSelected();
    	xtable_ids = sel.id;
    }

    var cfg={attributes:{modalWindow:true, href:'showForm?_fid=650&_tableId='+a._grid.crudTableId+'&_tablePk='+sel.id+'&xtable_ids='+xtable_ids}};
	
	if(sel.data.dsc)cfg.attributes._title_=sel.data.dsc;
	mainPanel.loadTab(cfg);
}

function fnSendSms(a){
	var sel=a._grid.sm.getSelected();
  	var table_pk='', url='';
  	for(var key in a._grid._pk){
  		table_pk+='|'+sel.data[a._grid._pk[key]];
  		url+="&"+a._grid._pk[key]+"="+sel.data[a._grid._pk[key]];
  	}
	var cfg={attributes:{modalWindow:true, href:'showForm?_fid=631&_tableId='+a._grid.crudTableId+'&_tablePk='+table_pk.substring(1)+url}};
	if(sel.data.dsc)cfg.attributes._title_=sel.data.dsc;
	mainPanel.loadTab(cfg);
}

function fnRecordPrivileges(a){
  	var sel = a._grid.sm.getSelected();
    if(!sel){
    	Ext.Msg.alert(getLocMsg('js_bilgi'),getLocMsg('js_once_birseyler_secmelisiniz'));
    	return
    }
	var sel=a._grid.sm.getSelected();
	var cfg={attributes:{modalWindow:true, href:'showPage?_tid=238&_gid1=477&crud_table_id='+a._grid.crudTableId+'&_table_pk='+sel.id,_pk:{access_roles:'access_roles',access_users:'access_users',paccess_flag:'access_flag',paccess_tip:'val',ptable_id:'!'+a._grid.crudTableId,ptable_pk:'!'+sel.id},baseParams:{xtable_id:a._grid.crudTableId, xtable_pk:sel.id}}};
	cfg.attributes._title_=sel.data.dsc ? a._grid.name+': '+sel.data.dsc : a._grid.name;
	mainPanel.loadTab(cfg);
}

function fnRecordDealerPrivilege(a){
  	var sel = a._grid.sm.getSelected();
    if(!sel){
    	Ext.Msg.alert(getLocMsg('js_bilgi'),getLocMsg('js_once_birseyler_secmelisiniz'));
    	return
    }
	var sel=a._grid.sm.getSelected();
	var cfg={attributes:{modalWindow:true, href:'showPage?_tid=656&xtable_id='+a._grid.crudTableId+'&xtable_pk='+sel.id,_pk:{pview_flag:'view_flag',pupdate_flag:'update_flag',pdealer_id:'dealer_id',ptable_id:'!'+a._grid.crudTableId,ptable_pk:'!'+sel.id},baseParams:{xtable_id:a._grid.crudTableId, xtable_pk:sel.id}}};
	cfg.attributes._title_=sel.data.dsc ? a._grid.name+': '+sel.data.dsc : a._grid.name;
	mainPanel.loadTab(cfg);
}

function buildHelpWindow(cfg){
    win = new Ext.Window({
    	id: cfg.hid,
        layout:'fit',
        width: cfg.hwidth*1,
        height:cfg.hheight*1,
        title: cfg.htitle,
        items : [
            {
            	xtype: 'panel',
            	autoScroll: true,
            	html: '<div style="margin: 5px 5px 5px 5px">'+cfg.hdsc+'</div>' 
            }
        ]
    });
    win.show();
    win.setPagePosition((mainViewport.getWidth()-win.getWidth())/2, (mainViewport.getHeight()-win.getHeight())/2);
}

function fnShowLog4Update(a,b){
	var sel=a._grid.sm.getSelected();
	if(!sel){
		Ext.Msg.alert(getLocMsg('js_bilgi'),getLocMsg('js_once_birseyler_secmelisiniz'));
    	return;
	}
	var paramz={_vlm:1};
	for(var key in a._grid._pk)paramz[key]=sel.data[a._grid._pk[key]];

	mainPanel.loadTab({attributes:{_title_:getLocMsg('js_duzenle_kaydi')+":"+ (sel.data.dsc||getLocMsg('js_kayit')),modalWindow:true, _grid:a._grid, href:'showPage?_tid=298&_gid1='+a._grid.gridId,baseParams:Ext.apply(paramz,a._grid.ds.baseParams)}})
}

function fnShowLog4Delete(a,b){
	 mainPanel.loadTab({attributes:{_title_:getLocMsg('js_silinenler_kaydi')+":",modalWindow:true, href:'showPage?_tid=298&_gid1='+a._grid.gridId,_grid:a._grid,baseParams:Ext.apply({_vlm:3},a._grid.ds.baseParams)}})
}

function addMoveUpDownButtons(xbuttons, xgrid){
	if(xgrid.crudTableId){
		if(xbuttons.length>0)xbuttons.push('-');
		xbuttons.push({tooltip:getLocMsg('js_yukari'), cls:'x-btn-icon x-grid-go-up', disabled:true, _activeOnSelection:true, _grid:xgrid, _direction: -1, handler:fnDataMoveUpDown});
		xbuttons.push({tooltip:getLocMsg('js_asagi'), cls:'x-btn-icon x-grid-go-down', disabled:true, _activeOnSelection:true, _grid:xgrid, _direction: 1, handler:fnDataMoveUpDown});
	}
}

function addDefaultCrudButtons(xbuttons, xgrid, modalflag){
	if(xbuttons.length>0)xbuttons.push('-');
	var xbl = xbuttons.length;
	/* crud buttons & import*/
	if(xgrid.crudFlags.insert){
		var cfg={id:'btn_add_'+xgrid.id,tooltip:getLocMsg('js_new'), cls:'x-btn-icon x-grid-new', ref:'../btnInsert', showModalWindowFlag: modalflag||false, _activeOnSelection:false, _grid:xgrid};
		if(xgrid.mnuRowInsert)cfg.menu=xgrid.mnuRowInsert;
		else cfg.handler=xgrid.fnRowInsert||fnRowInsert;
		xbuttons.push(cfg);
	}
	
	if(xgrid.crudFlags.edit)xbuttons.push({id:'btn_edit_'+xgrid.id,tooltip:getLocMsg('js_edit'),cls:'x-btn-icon x-grid-edit', ref:'../btnEdit', disabled:true, showModalWindowFlag: modalflag||false, _activeOnSelection:true, _grid:xgrid, handler:xgrid.fnRowEdit||fnRowEdit});
	if(xgrid.crudFlags.remove)xbuttons.push({id:'btn_delete_'+xgrid.id,tooltip:getLocMsg('js_delete'),cls:'x-btn-icon x-grid-delete', ref:'../btnDelete', disabled:true, _activeOnSelection:true, _grid:xgrid, handler:xgrid.fnRowDelete||fnRowDelete});
    if(xgrid.crudFlags.xcopy)xbuttons.push({id:'btn_copy_'+xgrid.id,tooltip:getLocMsg('js_copy'),cls:'x-btn-icon x-grid-copy-record', ref:'../btnCopy', disabled:true, showModalWindowFlag: modalflag||false, _activeOnSelection:true, _grid:xgrid, handler:xgrid.fnRowCopy||fnRowCopy});
	if(xgrid.crudFlags.ximport){
		if(typeof xgrid.crudFlags.ximport=='object' && typeof xgrid.crudFlags.ximport.length!='undefined'){
			var xmenu=[];
			for(var qi=0;qi<xgrid.crudFlags.ximport.length;qi++)if(!xgrid.crudFlags.ximport[qi].dsc)xmenu.push(xgrid.crudFlags.ximport[qi]); else {
				xmenu.push({text:xgrid.crudFlags.ximport[qi].dsc,cls:xgrid.crudFlags.ximport[qi].cls || '', _activeOnSelection:false, _grid:xgrid, ximport:xgrid.crudFlags.ximport[qi],handler:fnTableImport});
			}
			if(xgrid.extraButtons){
				var bxx=xmenu.length>0;
				for(var qi=0;qi<xgrid.extraButtons.length;qi++)if(xgrid.extraButtons[qi] && xgrid.extraButtons[qi].ref && xgrid.extraButtons[qi].ref.indexOf('../import_')==0){
					if(bxx){bxx=false;xmenu.push('-');}
					xgrid.extraButtons[qi]._grid=xgrid;
					xmenu.push(xgrid.extraButtons[qi]);
					xgrid.extraButtons.splice(qi,1);qi--;
				}
				if(xgrid.extraButtons.length==0)xgrid.extraButtons=undefined;
			}
			xbuttons.push({tooltip:getLocMsg('js_diger_kayitlardan_aktar'), cls:'x-btn-icon x-grid-import', _activeOnSelection:false, _grid:xgrid, menu:xmenu});
		} else
			xbuttons.push({tooltip:getLocMsg('js_diger_kayitlardan_aktar'), cls:'x-btn-icon x-grid-import', _activeOnSelection:false, _grid:xgrid, handler:fnTableImport});
	}
	/* revision */
	if(xgrid.extraOutMap && xgrid.extraOutMap.revMstTableId){
		if(xbl < xbuttons.length)xbuttons.push('-');
		xbuttons.push({tooltip:getLocMsg('js_revision'), cls:'x-btn-icon x-grid-revision', _activeOnSelection:false, _grid:xgrid, menu:[
	       {text:getLocMsg('js_revision_save'),_grid:xgrid, handler:function(ax,bx,cx){
	    	   var qstr=prompt(getLocMsg('enter_revision_name'),'REV-'+fmtShortDate(new Date()));
	    	   if(qstr){
	    		   promisRequest({
	    			   url:'ajaxSaveRevision', 
	    			   requestWaitMsg:true, 
	    			   params: {_dsc:qstr,_dtid:ax._grid.crudTableId, _mtid:ax._grid._masterGrid.crudTableId, _mtpk:ax._grid._masterGrid.sm.getSelected().id},
	    			   successDs:xgrid.ds
	    		   })
	    	   }
	       }},		                                                                                                   
	       {text:getLocMsg('js_revision_list'),_grid:xgrid, handler:function(ax,bx,cx){
	    	   var cfg= {attributes:{modalWindow:true,_title_:ax._grid.name,
	    			href:'showPage?_tid=259&_gid1=1381',_pk:{trevision_id:'revision_id'},baseParams:{xmaster_table_id:ax._grid._masterGrid.crudTableId,xtable_id:ax._grid.crudTableId,xmaster_table_pk:ax._grid._masterGrid.sm.getSelected().id,_grid:ax._grid}}};
	    	   mainPanel.loadTab(cfg);	    	   
	    	}}		                                                                                                   
		]});
		var revDf=new Ext.form.DisplayField({labelSeparator:'',width:100, value:'-'});
		xgrid._revDf=revDf;
		xbuttons.push(revDf);
	}
	if(xgrid.accessControlFlag && xgrid.accessDealerControlFlag){
		xbuttons.push({tooltip:getLocMsg('js_yetkilendirmeler'),cls:'x-btn-icon x-grid-record-privilege', disabled:true, _activeOnSelection:true ,menu:[{text:getLocMsg('js_kayit_bazli_yetkilendirme'), _grid:xgrid,handler:fnRecordPrivileges},{text:getLocMsg('js_bayi_yetkilendirme'), _grid:xgrid,handler:fnRecordDealerPrivilege}]});
	} else {
		if(xgrid.accessControlFlag)xbuttons.push({tooltip:getLocMsg('js_kayit_bazli_yetkilendirme'),cls:'x-btn-icon x-grid-record-privilege', disabled:true, _activeOnSelection:true ,_grid:xgrid, handler:fnRecordPrivileges});
		if(xgrid.accessDealerControlFlag)xbuttons.push({tooltip:getLocMsg('js_bayi_yetkilendirme'),cls:'x-btn-icon x-grid-record-privilege', disabled:true, _activeOnSelection:true ,_grid:xgrid, handler:fnRecordDealerPrivilege});
	}
	
	if(xgrid.logFlags){
		xbuttons.push('-');
		var xmenu=[];
		if(xgrid.logFlags.edit)xmenu.push({text:getLocMsg('js_guncellenme_listesini_goster'), _grid:xgrid, handler:fnShowLog4Update});
		if(xgrid.logFlags.remove)xmenu.push({text:getLocMsg('js_show_deleted_records'), _grid:xgrid, handler:fnShowLog4Delete});
		xbuttons.push({tooltip:getLocMsg('js_log'),cls:'x-btn-icon icon-log', _activeOnSelection:false, _grid:xgrid, menu:xmenu});
	}
}
function openFormSmsMail(tId,tPk,fsmId,fsmFrmId){
	mainPanel.loadTab({attributes:{href:'showForm?_fid=650&_tableId='+tId+'&_tablePk='+tPk+'&_fsmId='+fsmId+'&_fsmFrmId='+fsmFrmId}});
}

function addDefaultSpecialButtons(xbuttons, xgrid){
	var special=true;
	if(_app.mail_flag && 1*_app.mail_flag && xgrid.sendMailFlag){
		if(special)xbuttons.push('-');
		special=false;
		xbuttons.push({tooltip:getLocMsg('js_send_email'),cls:'x-btn-icon x-grid-mail', disabled:true, _activeOnSelection:true, _grid:xgrid, handler:fnSendMail});
	}
	if(xgrid.vcs){
		xbuttons.push({tooltip:getLocMsg('vcs'),cls:'x-btn-icon x-grid-vcs', _grid:xgrid, menu:fncMnuVcs(xgrid)});

	}
    if((_app.form_conversion_flag && 1*_app.form_conversion_flag && xgrid.formConversionList) || (_app.mail_flag && 1*_app.mail_flag && xgrid.formSmsMailList) || xgrid.reportList){
    	if(!xgrid.menuButtons)xgrid.menuButtons=[];
    	if(xgrid.menuButtons.length>0)xgrid.menuButtons.push('-');
    	if(_app.form_conversion_flag && 1*_app.form_conversion_flag && xgrid.formConversionList){
        	for(var qz=0;qz<xgrid.formConversionList.length;qz++){
        		xgrid.formConversionList[qz]._grid=xgrid;
				xgrid.formConversionList[qz].handler=function(aq,bq,cq){
					var sels=aq._grid.sm.getSelections();
					if(!sels || !sels.length)return;
					if(aq.preview){
						for(var qi=0;qi<sels.length;qi++)mainPanel.loadTab({attributes:{href:'showForm?a=2&_fid='+aq._fid+'&_cnvId='+aq.xid+'&_cnvTblPk='+sels[qi].id}});
					} else {
						var pr={_cnvId:aq.xid, _cnt:sels.length, form_id:aq._fid};
						for(var qi=0;qi<sels.length;qi++)pr["srcTablePk"+(qi+1)]=sels[qi].id; 
						promisRequest({url:'ajaxPostEditGrid',params:pr, successCallback:function(j){Ext.Msg.alert(getLocMsg('js_bilgi'),j.msgs.join('<br>'));}}); 
					}
				}
        	}
    		xgrid.menuButtons.push({text:getLocMsg('convert'), id:'cnv_mn_'+xgrid.id, iconCls:'icon-operation',menu:xgrid.formConversionList});
    	}
 
    	if(_app.mail_flag && 1*_app.mail_flag && xgrid.formSmsMailList){
			for(var qz=0;qz<xgrid.formSmsMailList.length;qz++){
				xgrid.formSmsMailList[qz]._grid=xgrid;
				xgrid.formSmsMailList[qz].handler=function(aq,bq,cq){
					var sel=aq._grid.sm.getSelected();
					if(!sel)return;
					mainPanel.loadTab({attributes:{href:'showForm?_fid='+(1*aq.smsMailTip ? 650:631)+'&_tableId='+aq._grid.crudTableId+'&_tablePk='+sel.id+'&_fsmId='+aq.xid+'&_fsmFrmId='+aq._grid.crudFormId}});
				}
			}
			xgrid.menuButtons.push({text:getLocMsg('js_send_email'), id:'mailsms_mn_'+xgrid.id, iconCls:'icon-email',menu:xgrid.formSmsMailList});
//			xbuttons.push({tooltip:getLocMsg('js_send_email'),cls:'x-btn-icon x-grid-mail', disabled:true, _activeOnSelection:true, _grid:xgrid, menu:xgrid.formSmsMailList});
    	}
        if(xgrid.reportList){
        	for(var qz=0;qz<xgrid.reportList.length;qz++){
        		xgrid.reportList[qz]._grid=xgrid;
    			xgrid.reportList[qz].handler=function(aq,bq,cq){
    				var sel=aq._grid.sm.getSelected();
    				if(!sel)return;
    				//mainPanel.loadTab({attributes:{href:'showForm?a=2&_fid='+aq._fid+'&_cnvId='+aq.xid+'&_cnvTblPk='+sel.id}});
    				openPopup("getReportResult?_rid="+aq.xid+"&_tb_pk="+sel.id,"report-"+aq.xid,800,600,1);
    			}
        	}
        	xgrid.menuButtons.push({text:getLocMsg('reports'),iconCls:'icon-ireport',menu:xgrid.reportList});
        }
    }
    
	if(xgrid.sendSmsFlag){
		if(special)xbuttons.push('-');
		special=false;
		xbuttons.push({tooltip:getLocMsg('js_send_sms'),cls:'x-btn-icon x-grid-sms', disabled:true, _activeOnSelection:true, _grid:xgrid, handler:fnSendSms});
	}
	
	special=true;
	if(_app.file_attachment_flag && 1*_app.file_attachment_flag && xgrid.fileAttachFlag){
		if(xbuttons.length>0)xbuttons.push('-');
		special=false;
		
		if(xgrid.gridId*1 != 1082){
			xbuttons.push({id:'btn_attachments_' + xgrid.id, tooltip:getLocMsg('js_iliskili_dosyalar'),cls:'x-btn-icon x-grid-attachment', disabled:true, _activeOnSelection:true ,_grid:xgrid, menu:[
			              {text:getLocMsg('js_dosya_sisteminden_ekle'),_grid:xgrid,handler:fnNewFileAttachment},
			              {text:getLocMsg('js_add_from_external_url'),_grid:xgrid,handler:fnNewFileAttachment4ExternalUrl},
			              {text:getLocMsg('js_daha_once_eklenmis_dosyalardan_ekle'),_grid:xgrid,handler:function(a,b){
			                    mainPanel.loadTab({attributes:{_title_:xgrid.name,modalWindow:true, href:'showPage?_tid=238&_gid1=672',tableId:a._grid.crudTableId,tablePk:a._grid.sm.getSelected().id}})
			              }}]});			
		}
		
		else{
			xbuttons.push({tooltip:getLocMsg('js_dosya_sisteminden_ekle'),cls:'x-btn-icon x-grid-attachment', disabled:true, _activeOnSelection:true ,_grid:xgrid, handler:fnNewFileAttachment});		
		}
	}
	if(_app.make_comment_flag && 1*_app.make_comment_flag && xgrid.makeCommentFlag){
		if(special)xbuttons.push('-');
		special=false;
		xbuttons.push({id:'btn_comments_' + xgrid.id, tooltip:getLocMsg('js_yorumlar'),cls:'x-btn-icon x-grid-comment', disabled:true, _activeOnSelection:true, _grid:xgrid, handler:fnRecordComments});
	}	
	if(xgrid.attachPictureFlag){
		if(special)xbuttons.push('-');
		special=false;
		xbuttons.push({id:'btn_pictures_' + xgrid.id, tooltip:getLocMsg('js_resimler'),cls:'x-btn-icon x-grid-picture', disabled:true, _activeOnSelection:true, _grid:xgrid, handler:fnRecordPictures});
	}
	if(_app.form_conversion_flag && 1*_app.form_conversion_flag && xgrid.formConversionList){
		xbuttons.push({id:'btn_converted_records_' + xgrid.id, tooltip:getLocMsg('js_converted_records'),cls:'x-btn-icon x-grid-conversion', disabled:true, _activeOnSelection:true, _grid:xgrid, handler:fnRecordConvertionLog});
	}
	if(_app.keyword_flag && 1*_app.keyword_flag && xgrid.keywordFlag){
		if(special)xbuttons.push('-');
		special=false;
		xbuttons.push({id:'btn_keywords_' + xgrid.id, tooltip:getLocMsg('js_anahtar_kelimeler'),cls:'x-btn-icon x-grid-keywords', disabled:true, _activeOnSelection:true, _grid:xgrid, handler:fnRecordKeywords});
	}
	if(xgrid.approveBulk){
    	if(!xgrid.menuButtons)xgrid.menuButtons=[];
    	if(xgrid.menuButtons.length>0)xgrid.menuButtons.push('-');
    	submenu = [];
    	if(xgrid.btnApproveRequest){
    		submenu.push({text:getLocMsg('onay_iste'), _grid: xgrid, handler: function(a, e){
    			var sels = a._grid.sm.getSelections();
    			if(sels.length==0){
    				Ext.Msg.show({title: getLocMsg('js_error'), msg: getLocMsg('commons.error.secim'), icon: Ext.MessageBox.ERROR});
    				return
    			}

    			for (var i=0; i<sels.length; i++){	
    				if (sels[i].data.pkpkpk_arf*1<0){
    					Ext.Msg.show({title: getLocMsg('js_error'), msg: getLocMsg('js_onay_adiminda_yer_almiyorsunuz'), icon: Ext.MessageBox.ERROR});
    					return;
    				} 
    				if (sels[i].data.pkpkpk_arf*1!=901){
    					Ext.Msg.show({title: getLocMsg('js_error'), msg: getLocMsg('secilenler_onay_istenecek_olmali'), icon: Ext.MessageBox.ERROR});
    					return;
    				}	
    			}
    			approveTableRecords(901,a);
    		}});
    	}
    	
    	submenu.push({text:getLocMsg('js_onayla'), _grid: xgrid, handler: function(a, e){
    		approveTableRecords(1,a);
    	}});
    	
    	submenu.push({text:getLocMsg('js_reddet'), _grid: xgrid, handler: function(a, e){
    		approveTableRecords(0,a);
    	}});
    	
    	submenu.push({text:getLocMsg('js_iade_et'), _grid: xgrid, handler: function(a, e){
    		approveTableRecords(2,a);
    	}});
		xgrid.menuButtons.push({text: getLocMsg('onay'),iconCls:'icon-operation',menu:submenu});
	}
}

function addGridExtraButtons(xbuttons, xgrid){
	if(!xgrid.extraButtons)return;
	if(xbuttons.length>0)xbuttons.push('-');
	var report_menu=[];
	var toolbar_menu=[];
	for(var j=0;j<xgrid.extraButtons.length;j++){
	    xgrid.extraButtons[j]._grid=xgrid;
	    xgrid.extraButtons[j].disabled=xgrid.extraButtons[j]._activeOnSelection;
	    
	    if(xgrid.extraButtons[j].ref && xgrid.extraButtons[j].ref.indexOf('../report_')==0){
	        report_menu.push(xgrid.extraButtons[j]);
	    }else{
	    	//if(toolbar_menu.length>0){toolbar_menu.push('-');}// toolbarlar arasına otomatik | koyar.
	        toolbar_menu.push(xgrid.extraButtons[j]);
	    }
	}
	xgrid.extraButtons = []; 

	if (report_menu.length != 0){
	    xgrid.extraButtons.push({tooltip:getLocMsg('js_report'), cls:'x-btn-icon x-grid-report', _activeOnSelection:false, _grid:xgrid, menu:report_menu});
	    xgrid.extraButtons.push('-');
	}
	if (toolbar_menu.length != 0)xgrid.extraButtons.push(toolbar_menu);

	xbuttons.push(xgrid.extraButtons);
}

function addDefaultReportButtons(xbuttons, xgrid, showMasterDetailReport){
	if (!xgrid.helpButton){xbuttons.push('->');
		if(xgrid.displayInfo)xbuttons.push('-');
	}
	var xxmenu=[];
	xxmenu.push({text:getLocMsg('js_pdfe_aktar'), _activeOnSelection:false, _grid:xgrid, handler:fnExportGridData('pdf')});
	xxmenu.push({text:getLocMsg('js_excele_aktar'),_activeOnSelection:false, _grid:xgrid, handler:fnExportGridData('xls')});
	xxmenu.push({text:getLocMsg('js_convert_to_csv'),_activeOnSelection:false, _grid:xgrid, handler:fnExportGridData('csv')});
	xxmenu.push({text:getLocMsg('js_convert_to_text'),_activeOnSelection:false, _grid:xgrid, handler:fnExportGridData('txt')});
	if(showMasterDetailReport){
		xxmenu.push('-');
		xxmenu.push({text:'MasterDetail -> '+getLocMsg('js_excele_aktar'),_activeOnSelection:false, _grid:xgrid, handler:fnExportGridDataWithDetail('xls')});
	}
	if(xgrid.ds && !xgrid.master_column_id){
		xxmenu.push('-');
		if(xgrid.crudTableId){
			xxmenu.push({text:getLocMsg('js_graph'),_activeOnSelection:false, _grid:xgrid, handler:fnGraphGridDataTree});
			xxmenu.push({text:'BI', menu:[{text:'Data List',_grid:xgrid, handler:function(aq){openPopup('showPage?_tid=784&xtable_id=' + aq._grid.crudTableId, '_blank', 1200, 800, 1);}},
			              				{text:'Pivot Table',_grid:xgrid, handler:function(aq){openPopup('showPage?_tid=1200&xtable_id=' + aq._grid.crudTableId + (showMasterDetailReport ? '&xmaster_table_id='+aq._grid._masterGrid.crudTableId:''), '_blank', 1200, 800, 1);}}]});
//			xxmenu.push({text:'Pivot Table',_activeOnSelection:false, _grid:xgrid, handler:function(aq){openPopup('showPage?_tid=1200&xtable_id=' + aq._grid.crudTableId, '_blank', 1200, 800, 1);}});
		} else {
			xxmenu.push({text:getLocMsg('js_graph'),_activeOnSelection:false, _grid:xgrid, handler:fnGraphGridData});
			xxmenu.push({text:'BI', menu:[{text:'Data List',_grid:xgrid, handler:function(aq){openPopup('showPage?_tid=784&xquery_id=' + aq._grid.queryId, '_blank', 1200, 800, 1);}},
				              				{text:'Pivot Table',_grid:xgrid, handler:function(aq){openPopup('showPage?_tid=2395&xquery_id=' + aq._grid.queryId, '_blank', 1200, 800, 1);}}]});
		}
	}
	xbuttons.push({id:'btn_reports_' + xgrid.id, tooltip:getLocMsg('reports'),cls:'x-btn-icon x-grid-pdf', _activeOnSelection:false, _grid:xgrid, menu: xxmenu});
}

function addHelpButton(xbuttons, xgrid, xtable_id, xtable_pk){
	//alert(xgrid.render().mf.basParams._tid);
	xbuttons.push('->');
	if(xgrid.displayInfo)xbuttons.push('-');	
	xbuttons.push({id:'btn_help_' + xgrid.id, tooltip:getLocMsg('help'),cls:'x-btn-icon x-grid-help', _activeOnSelection:false, _grid:xgrid, handler:function(){
		mainPanel.loadTab({
			attributes: {
				_title_: xgrid.name,
				modalWindow: true,
				href: 'showPage?_tid=977&xtable_id='+ xtable_id +'&xtable_pk='+ xtable_pk
			}
		});		
	}});
	xgrid.helpButton = true;
}

function addGridUserCustomizationsMenu(xgrid){
	var a= Ext.getCmp('grd_pers_buttons'+xgrid.gridId);
	if(!a._loaded){
		a._loaded=true;
		promisRequest({url:'ajaxQueryData?_qid=1052',params:{tgrid_id:a._grid.gridId},
		    successCallback:function(j){
				if(j.success && j.data.length>0){
				    while(a.menu.items.items.length>2)a.menu.remove(2);
				    a.menu.add('-')
				    for(var q=0;q<j.data.length;q++){
						var mitem={text:j.data[q].dsc,_id:j.data[q].user_grid_id,handler:function(ay,by,cy){
							promisRequest({requestWaitMsg:true,url:'ajaxExecDbFunc?_did=649',params:{puser_grid_id:ay._id}, successCallback:function(j2){
								if(j2.success && j2.result){
									var sort=j2.result.pout_sort_dsc;
									if(sort){
										var oo=sort.split(' ');
										if(oo.length>0 && oo[0])a._grid.ds.sortInfo={field:oo[0]};
										if(oo.length>1 && oo[1])a._grid.ds.sortInfo.direction=oo[1];
									}
									var cols=j2.result.pout_columns;
									if(cols && cols.length){
										var gp=a._grid._gp.getColumnModel();
										var oo=cols.split(';')
										for(var qi=0;qi<oo.length;qi++){
											var ooo=oo[qi].split(',');
											var ix=gp.findColumnIndex(ooo[0]);
											if(ix==-1){
											}else{
												if(ix!=qi){gp.moveColumn(ix,qi);}
												if(1*ooo[1]!=gp.getColumnWidth(qi)){/*gp.setColumnWidth(qi,j2.data[qi].column_width,true);*/}
												var h=1*ooo[2]==0
												if(!gp.config[qi].hidden ? h : !h)gp.setHidden(qi,h);
											}
										}
									}
									a._loaded=false;
									
									if(a._grid.searchForm){
										var cells=j2.result.pout_sfrm_cells;
										var fp=a._grid.ds._formPanel;
										if(cells && cells.length && fp){
											var oo=cells.split(';');
											var vals={}
											for(var qi=0;qi<oo.length;qi++){
												var ooo=oo[qi].split(',');
												vals[ooo[0]]=ooo[1].replace('~',',');
											}
											fp.getForm().setValues(vals);
										}
										if(j2.result.pout_grid_height && 1*j2.result.pout_grid_height>50){
											a._grid._gp.setSize(undefined,1*j2.result.pout_grid_height);
										}
										var c=1*j2.result.pout_sfrm_visible_flag==0;
										if(!fp.collapsed ? c:!c){if(c)fp.collapse(true);else fp.expand(true);}
										a._grid.ds.reload();
									}
								}
							}});
						}};
						if(1*j.data[q].default_flag!=0)mitem.checked=true;
						a.menu.add(mitem);
				    }
				}
		    }
		});
	}	
}

function addDefaultGridPersonalizationButtons(xbuttons, xgrid){
	xbuttons.push({id:'grd_pers_buttons'+xgrid.gridId, text:getLocMsg('js_kisisellestir'), _grid:xgrid,
		menu:{items:[{text:getLocMsg('js_bu_ayarlari_kaydet'), iconCls:'icon-ekle',_grid:xgrid,handler:function(ax,bx,cx){
				var pdsc =  prompt(getLocMsg('js_yeni_goruntu_adi'));
				if(!pdsc)return;
				var g=ax._grid,cols='',sort='',cells='';
				for(var z=0;z<g.columns.length;z++)cols+=';'+g.columns[z].dataIndex+','+g.columns[z].width+','+(!g.columns[z].hidden ? 1:0);
				if(g.ds.sortInfo && g.ds.sortInfo.field){
					sort=g.ds.sortInfo.field;
					if(g.ds.sortInfo.direction)sort+=' '+g.ds.sortInfo.direction;
				}
				var params={pcolumns:cols.substr(1),pdsc:pdsc,pgrid_id:ax._grid.gridId,psort_dsc:sort}
				if(g.searchForm){
					var fp=g.ds._formPanel
					if(fp){
						var m=fp.getForm().getValues();
						for(var qi in m)if(m[qi])cells+=';'+qi+','+m[qi].replace(/\,/g,'~')
						if(cells)params.psfrm_cells=cells.substr(1);
					}
					params.pgrid_height=g._gp.getHeight();
					params.psfrm_visible_flag=fp.collapsed?0:1;
				}
				
				promisRequest({requestWaitMsg:true,url:'ajaxExecDbFunc?_did=648',params:params, successCallback:function(j){
					Ext.Msg.alert(getLocMsg('js_tamam'), getLocMsg('js_mazgal_yeni_ayarlarla_gorunecek'));
				}});
				}
			},{text:getLocMsg('js_kaydedilenleri_duzenle'), _grid:xgrid,handler:function(ax,bx,cx){
				mainPanel.loadTab({attributes:{_title_:ax._grid.name,modalWindow:true, href:'showPage?_tid=238&_gid1=851&tgrid_id='+ax._grid.gridId,_pk:{tuser_grid_id:'user_grid_id'},baseParams:{tgrid_id:ax._grid.gridId}}})
			}}]
		}
	});
}


function addDefaultPrivilegeButtons(xbuttons, xgrid){
	if(_scd.administratorFlag || _scd.customizerFlag || xgrid.saveUserInfo){
		xbuttons.push(xgrid.gridReport ? '-':'->');
		var xxmenu=[], bx=false;
	    if(_scd.customizerFlag){xxmenu.push({text:getLocMsg('js_ayarlar'),cls:'x-btn-icon x-grid-setting', _activeOnSelection:false, _grid:xgrid, handler:fnGridSetting});bx=true;}
	    if(_scd.administratorFlag){xxmenu.push({text:getLocMsg('js_yetkiler'),cls:'x-btn-icon x-grid-privilege', _activeOnSelection:false, _grid:xgrid, handler:fnGridPrivilege});bx=true;}
	    if(true){
	    	if(bx)xxmenu.push('-');else bx=true;
	    	xxmenu.push({text:getLocMsg('js_bulk_edit'),cls:'x-btn-icon x-grid-bulk-edit', _grid:xgrid, handler:xgrid.fnRowBulkEdit||fnRowBulkEdit});
	    	xxmenu.push({text:getLocMsg('js_bulk_mail'),cls:'x-btn-icon x-grid-bulk-mail', _grid:xgrid, handler:xgrid.fnRowBulkMail||fnRowBulkMail});
	    }
	    if(_scd.customizerFlag && xgrid.crudTableId){
			if(bx)xxmenu.push('-');else bx=true;
			xxmenu.push({text:getLocMsg('report_settings'),cls:'x-btn-icon x-grid-setting', _activeOnSelection:false, _grid:xgrid, handler:fnGridReportSetting});
			xxmenu.push({text:'Detail Form+ Builder',cls:'x-btn-icon x-grid-setting', _activeOnSelection:false, _grid:xgrid, handler:function(ax){
				return  mainPanel.loadTab({attributes:{href:'showPage?_tid=8&parent_table_id='+ax._grid.crudTableId+'&tpl_id='+ax._grid.tplInfo.id+'&po_id='+ax._grid.tplInfo.objId}});
			}});
	    }
		if(xgrid.saveUserInfo){
			if(bx)xxmenu.push('-');else bx=true;
			addDefaultGridPersonalizationButtons(xxmenu,xgrid);
		}
		xbuttons.push({tooltip:getLocMsg('js_ayarlar'),cls:'x-btn-icon x-grid-setting', _activeOnSelection:false, _grid:xgrid, handler:function(x){addGridUserCustomizationsMenu(x._grid);},menu: xxmenu});
	}
}

function addDefaultCommitButtons(xbuttons, xgrid){
	xgrid.editMode = xgrid.onlyCommitBtn||false;
	if(xbuttons.length>0 || xgrid.pageSize)xbuttons.push('-');
	if(xgrid.crudTableId)xbuttons.push({id:'btn_commit_' + xgrid.id, tooltip:getLocMsg('js_commit'),cls:'x-btn-icon x-grid-commit', disabled: !xgrid.editMode, _activeOnSelection:false, ref:'../btnCommit', _grid:xgrid, handler:xgrid.fnCommit || fnCommit});
	if(!xgrid.onlyCommitBtn)xbuttons.push({id:'btn_edit_mode_' + xgrid.id, tooltip:getLocMsg('js_duzenle_modu'),cls:'x-btn-icon x-grid-startedit', _activeOnSelection:false, _grid:xgrid, ref:'../btnEditMode', enableToggle: true, toggleHandler: fnToggleEditMode});
}

function addTab4GridWSearchForm(obj){
	var mainGrid = obj.grid, searchFormPanel=null;
	if(obj.pk)mainGrid._pk = obj.pk; //{tcase_id:'case_id',tclient_id:'client_id',tobject_tip:'!4'}
	
	var grdExtra={
		stripeRows: true,
		region: 'center', clicksToEdit: 1*_app.edit_grid_clicks_to_edit
	};
	if(obj.t)mainGrid.id=obj.t+'-'+mainGrid.gridId;
	
	
	var buttons=[];
	if(mainGrid.searchForm && !mainGrid.pageSize){//refresh buttonu
		buttons.push({id:'btn_refresh_' + mainGrid.id, tooltip:getLocMsg('js_refresh'), iconCls:'x-tbar-loading', _activeOnSelection:false, _grid:mainGrid, handler:function(a){
			a._grid.ds.reload({params:a._grid._gp.store._formPanel.getForm().getValues()});
			}});
	}
	if(1*_app.grid_reset_btn && mainGrid.searchForm){
		if(mainGrid.pageSize)buttons.push('-');
        buttons.push({tooltip:getLocMsg('js_clear'),cls:'x-btn-icon x-grid-clear', _activeOnSelection:false, handler:function(){searchFormPanel.getForm().reset();}});
	}
	if(mainGrid.editGrid)addDefaultCommitButtons(buttons, mainGrid);	
	if(mainGrid.crudFlags)addDefaultCrudButtons(buttons, mainGrid);
	if(mainGrid.moveUpDown)addMoveUpDownButtons(buttons, mainGrid);
	addDefaultSpecialButtons(buttons, mainGrid);
	addGridExtraButtons(buttons,mainGrid);
	 
	if(mainGrid.detailView && mainGrid.detailDlg){ //selectionMode:5
		buttons.push({tooltip:getLocMsg('js_detay_penceresi'), cls:'x-btn-icon x-grid-dpencere', _grid:mainGrid, handler: fnShowDetailDialog});
	}

    if(mainGrid.menuButtons){
    	for(var j=0;j<mainGrid.menuButtons.length;j++){
        	mainGrid.menuButtons[j]._grid=mainGrid;
        }
    	mainGrid.menuButtons = new Ext.menu.Menu({enableScrolling:false, items:mainGrid.menuButtons});
        if(1*_app.toolbar_edit_btn){
        	if(buttons.length>0)buttons.push('-');
        	buttons.push({id: 'btn_operations_' + mainGrid.id, tooltip:getLocMsg('js_islemler'),cls:'x-btn-icon x-grid-menu', disabled:true, _activeOnSelection:true, menu: mainGrid.menuButtons});
        }
    }
    
    addHelpButton(buttons, mainGrid, 64, mainGrid.extraOutMap.tplId);    
	if(mainGrid.gridReport)addDefaultReportButtons(buttons,mainGrid);
	
	addDefaultPrivilegeButtons(buttons,mainGrid);

    if(mainGrid.pageSize){ // paging'li toolbar
        var tbarExtra = {xtype:'paging', store: mainGrid.ds, pageSize: mainGrid.pageSize, displayInfo: mainGrid.displayInfo};
        if(buttons.length>0)tbarExtra.items=organizeButtons(buttons);
        grdExtra.tbar=tbarExtra;
    } else if(buttons.length>0){//standart toolbar
        grdExtra.tbar=organizeButtons(buttons);
    }
     
    //grid 
    var eg = mainGrid.master_column_id ? (mainGrid.editGrid ? Ext.ux.maximgb.tg.EditorGridPanel : Ext.ux.maximgb.tg.GridPanel) : (mainGrid.editGrid ? Ext.grid.EditorGridPanel : Ext.grid.GridPanel);
    var mainGridPanel =  new eg(Ext.apply(mainGrid,grdExtra));
    mainGrid._gp=mainGridPanel;    
    if(mainGrid.editGrid){
    	mainGridPanel.getColumnModel()._grid=mainGrid;
    	if(!mainGrid.onlyCommitBtn){
    		mainGridPanel.getColumnModel().isCellEditable=function(colIndex,rowIndex){
    			if(this._grid._isCellEditable && this._grid._isCellEditable(colIndex,rowIndex,this._grid)===false)return false;
    			return this._grid.editMode;
    		}
    	} else if(mainGrid._isCellEditable)mainGridPanel.getColumnModel().isCellEditable=function(colIndex,rowIndex){
			return this._grid._isCellEditable(colIndex,rowIndex,this._grid);
		}
    }
    
    if(buttons.length>0){
    	mainGridPanel.getSelectionModel().on("selectionchange",function(a,b,c){
    		if(!a || !a.grid)return;
    		var titems = a.grid.getTopToolbar().items.items;
    		for(var ti=0;ti<titems.length;ti++){
    			if(titems[ti]._activeOnSelection)
    				titems[ti].setDisabled(!a.hasSelection());
    		}
    	});
    }
    var items = [];
	//---search form
    if(mainGrid.searchForm){
		searchFormPanel =  new Ext.FormPanel(Ext.apply(mainGrid.searchForm.render(),{
			region: 'north', bodyStyle:'padding:3px',
//			height: mainGrid.searchForm.defaultHeight||120,
			autoHeight:true,
			anchor: '100%',
			collapsible:true,
			title:mainGrid.searchForm.name,
			border: false,
			tools:searchFormTools,
			keys:{key:13,fn:mainGridPanel.store.reload,scope:mainGridPanel.store}
		}));
		
	    //--standart beforeload, ondbliclick, onrowcontextmenu
		if(mainGrid.crudFlags && mainGrid.crudFlags.edit && !mainGrid.crudFlags.nonEditDblClick/* && 1*_app.toolbar_edit_btn*/){mainGridPanel.on('rowdblclick',fnRowEditDblClick);}
		
	    if(mainGrid.menuButtons/* && !1*_app.toolbar_edit_btn*/){
	     	mainGridPanel.messageContextMenu = mainGrid.menuButtons;
	        mainGridPanel.on('rowcontextmenu', fnRightClick);
	    }
	    
		mainGridPanel.store._formPanel = searchFormPanel;
		mainGridPanel.store._grid = mainGrid;
		mainGridPanel.store.on('beforeload',function(a,b){
			if(a){
				if(a._grid.editMode)a._grid._deletedItems=[];
				if(a._formPanel.getForm())a.baseParams = Ext.apply(a._grid._baseParams || {},a._formPanel.getForm().getValues());
				if(a._grid && a._grid._gp && a._grid._gp._tid){
					var c=Ext.getCmp(a._grid._gp._tid);
					if(c && c._title){c.setTitle(c._title);c._title=false;}
				}
				if(a._grid.postCols && a._grid._gp.colModel && a._grid._gp.colModel.config){
					var c=a._grid._gp.colModel.config;
					var s='';
					for(var qi=0;qi<c.length;qi++){
						var cc=c[qi];
						if(!cc.hidden)s+=','+cc.dataIndex;
					}
					a.baseParams._cols=s.substring(1);
				}				
			}
		});
		items.push(searchFormPanel);
    }
	
    items.push(mainGridPanel);
	var p ={
        title: obj._title_||mainGrid.name,
        border: false,
        closable:true,
        layout: 'border',
        items: items,
        refreshGrids: obj._dontRefresh ? null : [mainGridPanel]
    };
//	p.iconCls='icon-cmp';
	if(obj.t){p.id=obj.t;mainGridPanel._tid=obj.t;}
    p = new Ext.Panel(p);
	p._windowCfg = {layout:'border'};
	p._callCfg=obj;
	if(mainGrid.liveSync)p._lg=true;
	if(mainGrid.searchForm)p._formId=mainGrid.searchForm.formId;
    return p;
}

function organizeButtons(items){
	if(!items)return null;
	for(var q=0;q<items.length;q++){
		if(items[q]._text)items[q].tooltip=items[q]._text;
	}
	return items;
}

function addTab4GridWSearchFormWithDetailGrids(obj, master_flag){

	var mainGrid = obj.grid;
	if(obj.pk)mainGrid._pk = obj.pk;
	
	var grdExtra=Ext.apply({
		region:obj.region || 'north',
		autoScroll:true,
		border: false},obj.grdExtra || {
		split:true,stripeRows: true,
		clicksToEdit: 1*_app.edit_grid_clicks_to_edit
	});
	if(obj.t)mainGrid.id=obj.t+'-'+mainGrid.gridId;
	
	if(grdExtra.region=='north'){
		grdExtra.height=mainGrid.defaultHeight||120;
		grdExtra.minSize=90;
		grdExtra.maxSize=300;
	} else {
		grdExtra.width=mainGrid.defaultWidth||400;		
		grdExtra.minSize=200;			
		if(grdExtra.width < 0){
			grdExtra.width = (-1*grdExtra.width)+"%";				
		}
		else{
			grdExtra.maxSize=grdExtra.width+100;
		}
	}
	
	var buttons=[];
	if(mainGrid.searchForm && !mainGrid.pageSize){//refresh buttonu
		buttons.push({id:'btn_refresh_' + mainGrid.id,tooltip:getLocMsg('js_refresh'), iconCls:'x-tbar-loading', _activeOnSelection:false, _grid:mainGrid, handler:function(a){
			a._grid.ds.reload({params:a._grid._gp.store._formPanel.getForm().getValues()});
			}});
	}
 	if(1*_app.grid_reset_btn && mainGrid.searchForm){
 		if(mainGrid.pageSize)buttons.push('-');
        buttons.push({id: 'btn_clear_' + mainGrid.id, tooltip:getLocMsg('js_clear'),cls:'x-btn-icon x-grid-clear', _activeOnSelection:false, handler:function(){searchFormPanel.getForm().reset();}});
	}
	if(mainGrid.editGrid)addDefaultCommitButtons(buttons, mainGrid);
//	if(mainGrid.gridId==26)alert(objProp(mainGrid.crudFlags))
	if(mainGrid.crudFlags)addDefaultCrudButtons(buttons, mainGrid);
	if(mainGrid.moveUpDown)addMoveUpDownButtons(buttons, mainGrid);
	addDefaultSpecialButtons(buttons, mainGrid);

	if(mainGrid.detailView && mainGrid.detailDlg){ //selectionMode:5
        buttons.push({tooltip:getLocMsg('js_detay_penceresi'), cls:'x-btn-icon x-grid-dpencere', _grid:mainGrid, handler: fnShowDetailDialog});
	}


    addGridExtraButtons(buttons,mainGrid);
    
    
    if(mainGrid.rmenu){
    	for(var j=0;j<mainGrid.rmenu.length;j++){
        	mainGrid.rmenu[j]._grid=mainGrid;
        }
    	mainGrid.rmenu = new Ext.menu.Menu({enableScrolling:false, items:mainGrid.rmenu});
        if(1*_app.toolbar_edit_btn){
        	if(buttons.length>0)buttons.push('-');
        	buttons.push({tooltip:getLocMsg('js_report'),cls:'x-btn-icon icon-report', disabled:true, _activeOnSelection:true, menu: mainGrid.rmenu});
        }
    }

    if(mainGrid.menuButtons){
    	for(var j=0;j<mainGrid.menuButtons.length;j++){
        	mainGrid.menuButtons[j]._grid=mainGrid;
        }
    	mainGrid.menuButtons = new Ext.menu.Menu({enableScrolling:false, items:mainGrid.menuButtons});
        if(1*_app.toolbar_edit_btn){
        	if(buttons.length>0)buttons.push('-');
        	buttons.push({id: 'btn_operations_' + mainGrid.id, tooltip:getLocMsg('js_islemler'),cls:'x-btn-icon x-grid-menu', disabled:true, _activeOnSelection:true, menu: mainGrid.menuButtons});
        }
    }
    if (master_flag && master_flag==1)addHelpButton(buttons,mainGrid, 5, mainGrid.gridId);
    else addHelpButton(buttons,mainGrid, 64, mainGrid.extraOutMap.tplId);
    
	if(mainGrid.gridReport)addDefaultReportButtons(buttons,mainGrid);
	mainGrid.isMainGrid=true;
	addDefaultPrivilegeButtons(buttons,mainGrid);

    if(mainGrid.pageSize){ // paging'li toolbar
        var tbarExtra = {xtype:'paging',store: mainGrid.ds, pageSize: mainGrid.pageSize, displayInfo: mainGrid.displayInfo};
        if(buttons.length>0)tbarExtra.items=organizeButtons(buttons);
        grdExtra.tbar=tbarExtra;
    } else if(buttons.length>0){//standart toolbar
        grdExtra.tbar=organizeButtons(buttons);
    }
    
    //grid 
    var eg = mainGrid.master_column_id ? (mainGrid.editGrid ? Ext.ux.maximgb.tg.EditorGridPanel : Ext.ux.maximgb.tg.GridPanel) : (mainGrid.editGrid ? Ext.grid.EditorGridPanel : Ext.grid.GridPanel);
    var mainGridPanel =  new eg(Ext.apply(mainGrid,grdExtra));
    mainGrid._gp=mainGridPanel;
    if(mainGrid.editGrid){
    	mainGridPanel.getColumnModel()._grid=mainGrid;
    	if(!mainGrid.onlyCommitBtn){
    		mainGridPanel.getColumnModel().isCellEditable=function(colIndex,rowIndex){
    			if(this._grid._isCellEditable && this._grid._isCellEditable(colIndex,rowIndex,this._grid)===false)return false;
    			return this._grid.editMode;
    		};
    	} else if(mainGrid._isCellEditable)mainGridPanel.getColumnModel().isCellEditable=function(colIndex,rowIndex){
			return this._grid._isCellEditable(colIndex,rowIndex,this._grid);
		};
    }
    	
    if(buttons.length>0){
    	mainGridPanel.getSelectionModel().on("selectionchange",function(a,b,c){
    		if(!a || !a.grid)return;
    		var titems = a.grid.getTopToolbar().items.items;
    		for(var ti=0;ti<titems.length;ti++){
    			if(titems[ti]._activeOnSelection)
    				titems[ti].setDisabled(!a.hasSelection());
    		}
    	});
    }
    if(mainGrid.menuButtons/* && !1*_app.toolbar_edit_btn*/){
     	mainGridPanel.messageContextMenu = mainGrid.menuButtons;
        mainGridPanel.on('rowcontextmenu', fnRightClick);
    }
	//---search form
	var searchFormPanel = null;
    if(mainGrid.searchForm){
    	var searchFormPanel = mainGrid.searchForm.fp = new Ext.FormPanel(Ext.apply(mainGrid.searchForm.render(),{
			region: 'north', bodyStyle:'padding:3px',
			autoHeight:true,
			anchor: '100%',
			collapsible:true,
			title:mainGrid.searchForm.name,
			border: false, id:'sf_'+(obj.t||Math.random()),
			tools:searchFormTools,
			keys:{key:13,fn:mainGridPanel.store.reload,scope:mainGridPanel.store}
		}));
    	mainGridPanel.store._formPanel = searchFormPanel;
    }
	
    //--standart beforeload, ondbliclick, onrowcontextmenu
	if(mainGrid.crudFlags && mainGrid.crudFlags.edit && !mainGrid.crudFlags.nonEditDblClick/* && 1*_app.toolbar_edit_btn*/){mainGridPanel.on('rowdblclick',fnRowEditDblClick);}

	mainGridPanel.store.on('beforeload',function(a,b){
		if(searchFormPanel){
			//mainGridPanel.store._formPanel = searchFormPanel;
			mainGridPanel.store._grid = mainGrid;
			if(a._grid.editMode)a._grid._deletedItems=[];
			a.baseParams = Ext.apply(a._grid._baseParams || {},a._formPanel.getForm().getValues());//a._formPanel.getForm().getValues();
		}
		if(mainGridPanel.getSelectionModel().getSelected())mainGridPanel._lastSelectedGridRowId = mainGridPanel.getSelectionModel().getSelected().id;
		if(a._grid && a._grid._gp && a._grid._gp._tid){
			var c=Ext.getCmp(a._grid._gp._tid);
			if(c && c._title){c.setTitle(c._title);c._title=false;}
		}
		if(a._grid && a._grid.postCols && a._grid._gp && a._grid._gp.colModel && a._grid._gp.colModel.config){
			var c=a._grid._gp.colModel.config;
			var s='';
			for(var qi=0;qi<c.length;qi++){
				var cc=c[qi];
				if(!cc.hidden)s+=','+cc.dataIndex;
			}
			a.baseParams._cols=s.substring(1);
		}
	});

	mainGridPanel.store.on('load',function(a,b){
		if(a.totalLength==0)return;
		var sm=mainGridPanel.getSelectionModel();
		if(!sm.hasSelection())sm.selectFirstRow();
		if(mainGridPanel._lastSelectedGridRowId && (1*mainGridPanel._lastSelectedGridRowId == 1*sm.getSelected().id)){
			mainGridPanel.getSelectionModel().fireEvent("selectionchange",mainGridPanel.getSelectionModel());
		}
	});
    
	//detail tabs
	var detailGridPanels = [];
	if(mainGrid.detailView && !mainGrid.detailDlg){ //selectionMode:5
		
		mainGridPanel._detailView = new Ext.DataView(Ext.apply({
			store: new Ext.data.JsonStore({
				fields: mainGridPanel.store.reader.meta.fields,
				root: 'data'
			}),
			tpl:mainGrid.detailView,
			autoScroll:true,
			overClass:'x-view-over',
			itemSelector:'table.grid_detay'
		},mainGrid.detailViewExtra || {}));
		
		mainGridPanel._detailViewPanel = new Ext.Panel({
			autoScroll:true,
		    title:getLocMsg('js_detay'),
		    items:mainGridPanel._detailView});//mainGridPanel._detailView
		   
		detailGridPanels.push(mainGridPanel._detailViewPanel);
		mainGridPanel.getSelectionModel().on("selectionchange",function(a,b,c){
			var sel=a.grid.getSelectionModel().getSelected();
			if(sel)a.grid._detailView.store.loadData({data:[sel.json]});
			else a.grid._detailView.store.loadData({data:[]});
		});

	}
	 	
	if(obj.detailGrids.length>1) obj.detailGrids.sort(function(a,b){ return (a.grid.tabOrder||-1) -(b.grid.tabOrder||-1)});// gridler template object sirasina gore geliyor.	
	for(var i=0;i<obj.detailGrids.length;i++){
		if(obj.detailGrids[i].detailGrids){//master/detail olacak
			if(!obj.detailGrids[i].grid.gridId)continue;
			
			delete  obj.detailGrids[i].grid.searchForm;// Detail gridlerin searchFormu olamaz. Patlıyor.
			
			var xmxm=addTab4GridWSearchFormWithDetailGrids(obj.detailGrids[i], 1);
			obj.detailGrids[i].grid._masterGrid = mainGrid;
			if(xmxm.items.items[0].xtype=='form'){ //ilk sıradaki gridin ,detail gridi varsa Search Formunu yok ediyor
				xmxm.items.items[0].destroy();	
			}
	
			var detailGridPanel=xmxm.items.items[0].items.items[0];
			
			grid2grid(mainGridPanel,detailGridPanel,obj.detailGrids[i].params, xmxm);

	        xmxm.closable=false;	     
			detailGridPanels.push(xmxm);
			
		} else {
			var detailGrid = obj.detailGrids[i].grid;			
			if(!detailGrid || !detailGrid.gridId)continue;
			detailGrid._masterGrid = mainGrid;
			if(obj.t)detailGrid.id=obj.t+'-'+detailGrid.gridId;
			
			if(detailGrid._ready){
				detailGridPanels.push(detailGrid);
				continue;
			}
			if(obj.detailGrids[i].pk)detailGrid._pk = obj.detailGrids[i].pk;
			var grdExtra={
				title:obj.detailGrids[i]._title_||detailGrid.name,stripeRows: true,id:'gr'+Math.random(), border:false,
				autoScroll:true, clicksToEdit: 1*_app.edit_grid_clicks_to_edit};
			var buttons=[];
	
	   		if(detailGrid.editGrid)addDefaultCommitButtons(buttons, detailGrid);	
	
			if(detailGrid.detailView && detailGrid.detailDlg){ //selectionMode:5
	            buttons.push({tooltip:getLocMsg('js_detay_penceresi'), cls:'x-btn-icon x-grid-dpencere', _grid:detailGrid, handler: fnShowDetailDialog});
			}
			
			if(detailGrid.hasFilter){
			    if(buttons.length>0)buttons.push('-');
			    buttons.push({tooltip:getLocMsg('js_filtreyi_kaldir'),cls:'x-btn-icon x-grid-funnel',_grid:detailGrid, handler:fnClearFilters});
			}
			
			if(detailGrid.crudFlags)addDefaultCrudButtons(buttons, detailGrid);
			if(detailGrid.moveUpDown)addMoveUpDownButtons(buttons, detailGrid);
			addDefaultSpecialButtons(buttons, detailGrid);
		    addGridExtraButtons(buttons,detailGrid);
            
		    if(detailGrid.menuButtons){
	         	for(var j=0;j<detailGrid.menuButtons.length;j++){
	         		detailGrid.menuButtons[j]._grid=detailGrid;
	             }
	         	detailGrid.menuButtons = new Ext.menu.Menu({enableScrolling:false, items:detailGrid.menuButtons});
	             if(1*_app.toolbar_edit_btn){
	             	if(buttons.length>0)buttons.push('-');
	             	buttons.push({id: 'btn_operations_' + detailGrid.id, tooltip:getLocMsg('js_islemler'),cls:'x-btn-icon x-grid-menu', disabled:true, _activeOnSelection:true, menu: detailGrid.menuButtons});
	             }
	         }
		    
		    addHelpButton(buttons, detailGrid, 5, detailGrid.gridId);
	     	if(detailGrid.gridReport)addDefaultReportButtons(buttons,detailGrid, true);
	    	addDefaultPrivilegeButtons(buttons,detailGrid);
	    	if(detailGrid.maximizeFlag){
	    		buttons.push('-');
	    		buttons.push({tooltip:getLocMsg('js_mazgali_buyut'),cls:'x-btn-icon x-grid-resize', _activeOnSelection:false, _grid:detailGrid, handler:function(a,b,c){
	    			var href='showPage?_tid=622&_gid1='+a._grid.gridId;
	    			if(a._grid._masterGrid && a._grid._masterGrid.crudTableId && a._grid._masterGrid.sm.hasSelection()){
	    				href+='&_mtid='+a._grid._masterGrid.crudTableId+'&_mtpk='+a._grid._masterGrid.sm.getSelected().id;
	    			}
	    			mainPanel.loadTab({attributes:{href:href,_grid:a._grid,baseParams:a._grid.ds.baseParams}});
	    		}});
	    	}
	
	 		
	         if(detailGrid.pageSize){ // paging'li toolbar
	             var tbarExtra = {xtype:'paging', store: detailGrid.ds, pageSize: detailGrid.pageSize, displayInfo: detailGrid.displayInfo};
	             if(buttons.length>0)tbarExtra.items=organizeButtons(buttons);
	             grdExtra.tbar=tbarExtra;
	         } else if(buttons.length>0){//standart toolbar
	             grdExtra.tbar=organizeButtons(buttons);
	         }
	
	        var eg = detailGrid.master_column_id ? (detailGrid.editGrid ? Ext.ux.maximgb.tg.EditorGridPanel : Ext.ux.maximgb.tg.GridPanel) : (detailGrid.editGrid ? Ext.grid.EditorGridPanel : Ext.grid.GridPanel);
			var detailGridPanel = new eg(Ext.apply(detailGrid,grdExtra));
			detailGrid._gp=detailGridPanel;
		    if(detailGrid.editGrid){
		    	detailGridPanel.getColumnModel()._grid=detailGrid;
		    	if(!detailGrid.onlyCommitBtn){
		    		detailGridPanel.getColumnModel().isCellEditable=function(colIndex,rowIndex){
		    			if(this._grid._isCellEditable && this._grid._isCellEditable(colIndex,rowIndex,this._grid)===false)return false;
		    			return this._grid.editMode;
		    		};
		    	} else if(detailGrid._isCellEditable)mainGridPanel.getColumnModel().isCellEditable=function(colIndex,rowIndex){
					return this._grid._isCellEditable(colIndex,rowIndex,this._grid);
				};
		    }
	
			if(detailGrid.menuButtons/* && !1*_app.toolbar_edit_btn*/){
				detailGridPanel.messageContextMenu = detailGrid.menuButtons;
				detailGridPanel.on('rowcontextmenu', fnRightClick);
	        }
	/*	    if(detailGrid.saveUserInfo)detailGridPanel.on("afterrender",function(a,b,c){
				detailGridPanel.getView().hmenu.add('-',{text: 'Mazgal Ayarları',cls:'grid-options1',menu: {items:[{text:'Mazgal Ayarlarını Kaydet',handler:function(){saveGridColumnInfo(grid.getColumnModel(),mainGrid.gridId)}},
			    	                                                                                       {text:'Varsayılan Ayarlara Dön',handler:function(){resetGridColumnInfo(mainGrid.gridId)}}]}});
		    }); */
			if(detailGridPanel.crudFlags && detailGridPanel.crudFlags.edit && !detailGridPanel.crudFlags.nonEditDblClick/* && 1*_app.toolbar_edit_btn*/){detailGridPanel.on('rowdblclick',fnRowEditDblClick);}
			if(detailGrid.extraOutMap && detailGrid.extraOutMap.revMstTableId){
				obj.detailGrids[i].params._revMstTableId='!'+detailGrid.extraOutMap.revMstTableId;
				obj.detailGrids[i].params._revMstTablePk=detailGrid.extraOutMap.revMstTablePKField;
				obj.detailGrids[i].params._revDtlTableId='!'+detailGrid.extraOutMap.revDtlTableId;
			}
			grid2grid(mainGridPanel,detailGridPanel,obj.detailGrids[i].params);
	        if(buttons.length>0){
	        	detailGridPanel.getSelectionModel().on("selectionchange",function(a,b,c){
	        		if(!a || !a.grid)return;
	        		var titems = a.grid.getTopToolbar().items.items;
	        		for(var ti=0;ti<titems.length;ti++){
	        			if(titems[ti]._activeOnSelection)titems[ti].setDisabled(!a.hasSelection());
	        		}
	        	});
	        }
			detailGridPanels.push(detailGridPanel);
		}
	} 
	var scrollerMenu = new Ext.ux.TabScrollerMenu({
		maxText  : 15,
		pageSize : 5
	});
    var lastItems=[];
    if(searchFormPanel!=null){
    	lastItems.push(searchFormPanel)
    }
    
    var subTab={region:'center',
			enableTabScroll:true,
			activeTab:0,
			visible:false,
			items:detailGridPanels,
			plugins:[scrollerMenu]};
    
    if(obj.t)subTab.id='sub_tab_'+obj.t;
    
    lastItems.push({
		region:'center',
		layout:'border',
		items:[mainGridPanel,new Ext.TabPanel(subTab)]})
    var p = {
	    layout: 'border',
        title:obj._title_||mainGrid.name,
        border: false,
        closable:true,
        items:lastItems,        
        refreshGrids: obj._dontRefresh ? null : (searchFormPanel?[mainGridPanel]:null)
    };    
	if(obj.t){p.id=obj.t;mainGridPanel._tid=obj.t;}
    p = new Ext.Panel(p);
	p._windowCfg = {layout:'border'};
	p._callCfg=obj;
	if(mainGrid.liveSync)p._lg=true;
	if(mainGrid.searchForm)p._formId=mainGrid.searchForm.formId;
    return p;
}

function prepareLogErrors(obj){
	if(!obj.logErrors)return 'eksik';
	var str="";
	for(var xi=0;xi<obj.logErrors.length;xi++){
		str+="<b>"+(xi+1)+".</b> "+ obj.logErrors[xi].dsc;
		if(obj.logErrors[xi]._record)str+=renderParentRecords(obj.logErrors[xi]._record,1)+"<br>";
		else if(xi<obj.logErrors.length-1){
			str+="<br>&nbsp;<br>";
		}
	}
	return str;
}
function ajaxErrorHandler(obj){
		
    if (obj.errorType && (obj.errorType=='sql' || obj.errorType=='vcs' || obj.errorType=='rhino')){
    	if(1*_app.debug != 1){
    		var jsm ={title: getLocMsg('js_hata'),
        			msg: '<b>'+obj.error+'</b>',
        			icon: Ext.MessageBox.ERROR}
    		if(obj.logErrors){
    			jsm.msg+='<br/>&nbsp<br/>'+obj.logErrors.length+' adet detay kayit vardir. Detay gormek ister misiniz?'
    			jsm.buttons=Ext.MessageBox.YESNO;
    			jsm.fn=function(btn){
    				if(btn=='yes')Ext.Msg.show({title: 'Log Details...',msg: prepareLogErrors(obj),icon: Ext.MessageBox.WARNING});
    			}
    		}
    		Ext.Msg.show(jsm);
    	}
    	else{
    		var xbuttons =[];
    		if(obj.errorType=='rhino' && obj.error && obj.error.indexOf('script#')>-1 && obj.sql){
    			var xl = obj.error.substr(obj.error.indexOf('script#')+7);
    			var ml = 0;
    			for(var qi=0;qi<xl.length;qi++)if(xl.substr(qi,1)<'0' || xl.substr(qi,1)>'9')break;
    			else ml=10*ml+1*xl.substr(qi,1);
    			xbuttons.push({text:'RhinoScript Error',handler:function(){
    				var _code=new Ext.ux.form.CodeMirror({hideLabel: true , mode:'javascript', 
    				    config:{matchBrackets: true, lint:true, foldGutter: true, 
    				    gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"]},name: 'code',anchor:'%100', height:'%100',value:obj.sql});

    				new Ext.Window({
    			        modal: true, closable:true,
    			        title: 'RhinoScript Error: '+obj.error,
    			        width: 1000, height: 380, border: false, layout: 'border',
    			        items: [new Ext.FormPanel({region:'center', items:[_code]})]
    				}).show();
					var doc=_code.codeEditor.doc;
					doc.addLineClass(ml-1,'background','veliSel');

    			}});
    		}
    		if(obj.stack)xbuttons.push({text:'Java StackTrace',handler:function(){alert(obj.stack);}});
    		xbuttons.push({text:getLocMsg('js_kapat'),handler:function(){wndx.close();}});
	        var wndx=new Ext.Window({
	            modal:true,
	            title:'DB.SQL/Rhino Error',
	            width: 800,
	            height:187,
	            items:[{    
	                xtype:'propertygrid',
	                autoHeight: true,
	                propertyNames: {
	                },
	                customEditors:{
	                    'SQL': new Ext.grid.GridEditor(new Ext.form.TextArea({selectOnFocus:true,height:120})),
	                    'Error':new Ext.grid.GridEditor(new Ext.form.TextArea({selectOnFocus:true,height:120}))
	                },
	                source: {
	                    'Object Type': obj.objectType || '<'+getLocMsg('js_belirtilmemis')+'>',
	                    'Object ID': obj.objectId || '<'+getLocMsg('js_belirtilmemis')+'>',
	                    'Error': obj.error || '<'+getLocMsg('js_belirtilmemis')+'>',
	                    'SQL':obj.sql || '<'+getLocMsg('js_belirtilmemis')+'>'
	                },
	                viewConfig : { forceFit: true, scrollOffset: 2 // the grid will never have scrollbars
	                }
	            }],
	        buttons:xbuttons
	        });
	        wndx.show();
	        wndx.items.items[0].getColumnModel().setColumnWidth(0,100);
	        wndx.items.items[0].getColumnModel().setColumnWidth(1,wndx.items.items[0].getColumnModel().getColumnWidth(1)+300);
    	}
    }else if (obj.errorType && obj.errorType=='validation'){
        var msg='<b>'+getLocMsg('js_alan_dogrulama_hatalari')+'</b><ul>';
        if(obj.errors){
        	for (var i=0;i<obj.errors.length;i++)if (obj.errors[i].id!='_')
        		msg+='<li>&nbsp;&nbsp;&nbsp;&nbsp;'+(obj.errors[i].dsc || obj.errors[i].id)+' - '+obj.errors[i].msg+'</li>';
        } else if(obj.error){
        	msg+=obj.error;
        }
        msg+='</ul>';
        Ext.Msg.show({title:getLocMsg('js_hata'),msg: msg,icon: Ext.MessageBox.ERROR})
    }else if (obj.errorType && obj.errorType=='framework'){
    	var xbuttons =[];
		if(obj.errorType=='rhino' && obj.error && obj.error.indexOf('script#')>-1 && obj.sql){
			var xl = obj.error.substr(obj.error.indexOf('script#')+7);
			var ml = 0;
			for(var qi=0;qi<xl.length;qi++)if(xl.substr(qi,1)<'0' || xl.substr(qi,1)>'9')break;
			else ml=10*ml+1*xl.substr(qi,1);
			xbuttons.push({text:'RhinoScript Error',handler:function(){
				var _code=new Ext.ux.form.CodeMirror({hideLabel: true , mode:'javascript', 
				    config:{matchBrackets: true, lint:true, foldGutter: true, 
				    gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"]},name: 'code',anchor:'%100', height:'%100',value:obj.sql});

				new Ext.Window({
			        modal: true, closable:true,
			        title: 'RhinoScript Error: '+obj.error,
			        width: 1000, height: 380, border: false, layout: 'border',
			        items: [new Ext.FormPanel({region:'center', items:[_code]})]
				}).show();
				var doc=_code.codeEditor.doc;
				doc.addLineClass(ml-1,'background','veliSel');

			}});
		}
		if(obj.stack)xbuttons.push({text:'Java StackTrace',handler:function(){alert(obj.stack);}});
		xbuttons.push({text:getLocMsg('js_kapat'),handler:function(){wndx.close();}});
        var wndx=new Ext.Window({
            modal:true,
            title:'Framework Error',
            width: 800,
            height:167,
            items:[{    
                xtype:'propertygrid',
                autoHeight: true,
                source: {
                    'Object Type': obj.objectType || '<'+getLocMsg('js_belirtilmemis')+'>',
                    'Object ID': obj.objectId || '<'+getLocMsg('js_belirtilmemis')+'>',
                    'Error': obj.error || '<'+getLocMsg('js_belirtilmemis')+'>'
                },  
                customEditors:{
                    'Error':new Ext.grid.GridEditor(new Ext.form.TextArea({selectOnFocus:true,height:120}))
                },
            
                viewConfig : {
                    forceFit: true,
                    scrollOffset: 2 // the grid will never have scrollbars
                }
            }],
        buttons:xbuttons
        });
        wndx.show();
        wndx.items.items[0].getColumnModel().setColumnWidth(0,100);
        wndx.items.items[0].getColumnModel().setColumnWidth(1,wndx.items.items[0].getColumnModel().getColumnWidth(1)+300);          
    }else if (obj.errorType && obj.errorType=='session')
        showLoginDialog(obj);
    else if (obj.errorType && obj.errorType=='security')
	    Ext.Msg.show({
	    	title: getLocMsg('js_guvenlik_hatasi'), 
	    	msg: getLocMsg('js_hata')+': <b>'+(obj.error || getLocMsg('js_belirtilmemis'))+'</b><br/>'+obj.objectType+" Id: <b>"+obj.objectId+'</b>', 
	    	icon: Ext.MessageBox.ERROR});
    else
        Ext.Msg.show({title:getLocMsg('js_bilgi'),msg: msg,icon: Ext.MessageBox.INFO})
    
}
var lw=null;
function ajaxAuthenticateUser(){
    Ext.getCmp('loginForm').getForm().submit({
        url: 'ajaxAuthenticateUser?userRoleId='+_scd.userRoleId+'&locale='+_scd.locale+(_scd.projectId ? '&projectId='+_scd.projectId:''),
        method:'POST', 
		clientValidation: true,
        waitMsg : getLocMsg('js_entering')+'...',
        success: function(o,resp){
	        if(resp.result.success){
	        	if(resp.result.smsFlag){
	        		Ext.MessageBox.prompt('SMS Doğrulama', 'Mobil Onay Kodu', function(btn,text){
	        			if(btn == "ok"){
	        				Ext.Ajax.request({
	        					url:"ajaxSmsCodeValidation?smsCodeValidId="+resp.result.smsValidationId+"&smsCode="+text,
	        					success: function (result, request) {					
	        						var resp=eval('('+result.responseText+')');
	        						if(resp.success){
	        				        	lw.destroy();
	        				        	hideStatusText();
	        				        	refreshGridsAfterRelogin();
	        				        	longPollTask.delay(0);
	        						}
	        						else {
	        							Ext.Msg.show({title: getLocMsg('js_hata'), msg: 'Hatalı SMS Kodu', icon: Ext.MessageBox.ERROR});
	        						}
	        					}
	        				});
	        			}
	        		});
	        	}else{
		        	lw.destroy();
		        	hideStatusText();
		        	refreshGridsAfterRelogin();
		        	longPollTask.delay(0);
	        	}
//	        	if(typeof onlineUsersGridPanel!='undefined' && onlineUsersGridPanel)reloadOnlineUsers();
	        }else {
	            Ext.MessageBox.alert(getLocMsg('js_hata'),resp.errorMsg||getLocMsg('js_yanlis_kullanici_adi_sifre'));
			}
    	},
	    failure: function(o,resp){
			var resp=eval('('+resp.response.responseText+')');
	        if(resp.errorMsg){
	            Ext.MessageBox.alert(getLocMsg('js_hata'),resp.errorMsg);
	            getSecurityWord();
	        }else{
	            Ext.MessageBox.alert(getLocMsg('js_hata'),resp.error||getLocMsg('js_verileri_kontrol'));
	        }
	    }
    });
  return false;    
}

function getSecurityWord(){
	 Ext.Ajax.request({
	     url : 'ajaxGetSecurityPicture' ,       
		 method: 'POST',
		 success: function (result, request) {
		 var resp=eval('('+result.responseText+')');
		 if(resp.success && resp.data.length>0 ){				
			var file_name=resp.data[0].file_name;				
			Ext.get("security_div").dom.innerHTML = '<img src=../images/security/'+file_name+'>';
		 } else {
			if (Ext.get("security_word_table")){
				Ext.get("security_word_table").dom.innerHTML='';
				Ext.get("securityword_l").dom.innerHTML='';	   
			}     
		 }
	 }
	});			
}
function showLoginDialog(xobj){
	if(lw && lw.isVisible())return;
	if(typeof onlineUsersGridPanel!='undefined' && onlineUsersGridPanel)onlineUsersGridPanel.store.removeAll();
	var fs = new Ext.form.FormPanel({
		id: 'loginForm',
		name: 'loginForm',
		frame: false,
		border: false,
		labelAlign:'right',
		labelWidth:100,
		waitMsgTarget: true,
		method: 'POST',
		buttonAlign: 'center',
		buttons: [
		{
			text: getLocMsg('js_giris'),
			iconCls: 'button-enter',
			handler: ajaxAuthenticateUser
		},
		{
           text: getLocMsg('js_cikis'),
           iconCls: 'button-exit',
           handler: function(){document.location='login.htm?r='+new Date().getTime();
        }
		}],                       
		items :pfrm_login.render().items[0].items
	});
	
	lw = new Ext.Window({
        modal:true,
        title:pfrm_login.name,
        width: 350,
        height: 225,
        layout: 'fit',
        items:fs,
        bodyStyle:'background-color:#fff;padding: 10px',
        closable:false
    });
	lw.show();
	
	var nav = new Ext.KeyNav(Ext.getCmp('loginForm').getForm().getEl(), {
		'enter':ajaxAuthenticateUser,
		'scope': Ext.getCmp('loginForm')
	});	
}


function formSubmit(submitConfig){
    var cfg = {
        waitMsg: getLocMsg('js_lutfen_bekleyin'),
        clientValidation: true,
        success: function(form,action){
            var myJson = eval('(' + action.response.responseText+ ')');
            var jsonQueue = [];
            if(myJson.smsMailPreviews && myJson.smsMailPreviews.length>0){
            	for(var ix=0;ix<myJson.smsMailPreviews.length;ix++){
            		var smp=myJson.smsMailPreviews[ix];            		
            		var ss="";
            		if (smp.tbId==683)//w5_customer_feedback
            			ss="&tcustomization_id="+submitConfig.extraParams.tcustomization_id;
            		jsonQueue.push({attributes:{href:'showForm?_fid='+(smp.fsmTip ? 650:631)+'&_tableId='+smp.tbId+'&_tablePk='+smp.tbPk+'&_fsmId='+smp.fsmId+'&_fsmFrmId='+myJson.formId+ss}});
            	}
            } 
            if(myJson.conversionPreviews && myJson.conversionPreviews.length>0){
            	for(var ix=0;ix<myJson.conversionPreviews.length;ix++){
            		var cnvp=myJson.conversionPreviews[ix];
            		var ppp = {attributes:{href:'showForm?a=2&_fid='+cnvp._fid+'&_cnvId='+cnvp._cnvId+'&_cnvTblPk='+cnvp._cnvTblPk}};
            		if(cnvp._cnvDsc)ppp._cnvDsc=cnvp._cnvDsc;
            		jsonQueue.push(ppp);
            	}
            } 
            
            if(myJson.alarmPreviews && myJson.alarmPreviews.length>0){
            	alert('TODO ALARM PREVIEWS: ' + myJson.alarmPreviews.length + " adet");//TODO
            } 
            
            if(jsonQueue.length>0){
            	var jsonQueueCounter = 0;
            	var autoOpenForms = new Ext.util.DelayedTask(function(){
            		mainPanel.loadTab(jsonQueue[jsonQueueCounter]);
            		if(jsonQueue[jsonQueueCounter]._cnvDsc)Ext.infoMsg.msg('Form Donusum',jsonQueue[jsonQueueCounter]._cnvDsc);
            		jsonQueueCounter++;
            		if(jsonQueue.length>jsonQueueCounter)autoOpenForms.delay(1000);
            	});
            	autoOpenForms.delay(1);
            }
            
            /*if(myJson.nextBpmActions && myJson.nextBpmActions.length>0){
            	myJson.nextBpmActions[0].checked=true;
            	var qwin = new Ext.Window({
                    layout:'fit',
                    width:300,
                    height:200,
                    closeAction:'destroy',
                    plain: true, modal:true,
                    title:'BPM Devami...',
                    items: {xtype:'form', border:false,labelWidth:10,items:{
                    xtype: 'radiogroup',itemCls: 'x-check-group-alt',id:'promisRadioGroup1',columns: 1,items:myJson.nextBpmActions}},
                    buttons: [{
                        text:'Sec',
                        handler:function(ax,bx,cx){
                    		var prg = Ext.getCmp('promisRadioGroup1');
                            if(prg.getValue() && prg.getValue().getValue()){
                            	var fxx=prg.getValue().js_code;
                                qwin.destroy();
                            	eval('fxx=function(xax,xbx){\n'+fxx+'\n}');
                            	fxx(myJson);
                            }
                        }
                    },{
                        text: 'Iptal',
                        handler: function(){
                            qwin.destroy();
                        }
                    }]
                });
                qwin.show();
                
            }else */if(myJson.logErrors || myJson.msgs){
            	var str='';
            	if(myJson.msgs)str=myJson.msgs.join('<br>')+'<p>';
            	if(myJson.logErrors)str+=prepareLogErrors(myJson);
            	Ext.Msg.show({title: getLocMsg('js_bilgi'),msg: str,icon: Ext.MessageBox.INFO});
            } /*else if(1*_app.mail_send_background_flag!=0 && myJson.outs && myJson.outs.thread_id){ //DEPRECATED
            	Ext.infoMsg.msg(getLocMsg('js_tamam,getLocMsg('js_eposta_gonderiliyor+'...');
            }*/
            else if(_app.show_info_msg && 1*_app.show_info_msg!=0)Ext.infoMsg.msg(getLocMsg('js_tamam'),getLocMsg('js_islem_basariyla_tamamlandi'));
            if(submitConfig.callback){
            	if(submitConfig.callback(myJson,submitConfig)===false)return;
            }
            
            if (submitConfig._closeWindow){
            	submitConfig._closeWindow.destroy();
            }
            else if(submitConfig.modalWindowFormSubmit){
            	submitConfig.tabp.remove(submitConfig.tabp.getActiveTab());          	
            }
            
            else if (!submitConfig.dontClose && !mainPanel.closeModalWindow()){
            	mainPanel.remove(mainPanel.getActiveTab());
            }
            
            if(submitConfig.resetValues){
            	submitConfig.formPanel.getForm().reset();
            }else{
            	// Özel kodlama alanları resetlenmeli
            	if(submitConfig.dontClose){
	            	submitConfig.formPanel.getForm().items.each(function(itm){
	            		if(itm._controlTip*1 == 31){
	            			itm.setValueFromSystem();
	            		}
	            	});
            	}
            }
            
            if(submitConfig._callAttributes){
            	if(submitConfig._callAttributes._grid){
            		if(_app.live_sync_record && 1 * _app.live_sync_record!=0 )Ext.defer(function(g){g.ds.reload();}, 1000, this,[submitConfig._callAttributes._grid]);
            		else submitConfig._callAttributes._grid.ds.reload();
            	}
            }

        },
        failure:function(form, action) {
            switch (action.failureType) {
            case Ext.form.Action.CLIENT_INVALID:
                Ext.Msg.alert(getLocMsg('js_hata'), getLocMsg('js_form_alan_veri_dogrulama_hatasi'));
                break;
            case Ext.form.Action.CONNECT_FAILURE:
                Ext.Msg.alert(getLocMsg('js_hata'), getLocMsg('js_no_connection_error'));
                break;
            case Ext.form.Action.SERVER_INVALID:
            	if(action.result.msg){
	            	Ext.Msg.alert(getLocMsg('js_hata'), action.result.msg);
	            	break;
            	}
//            case Ext.form.Action.LOAD_FAILURE:
            default:
            	if(action.result && action.result.errorType && action.result.errorType=='confirm'){
            		var obj=action.result;
            		if(confirm(obj.error)){//TODO. burda birseyler yapilacak. baseParams['_confirmId_'+obj.objectId]=1 eklenecek
            			var fm=submitConfig.formPanel.getForm();
            			if(!fm.baseParams)fm.baseParams={}
            			fm.baseParams['_confirmId_'+obj.objectId]=1;
            			fm.submit(cfg);
            		}
            	} else
            		ajaxErrorHandler(action.result);
            	break;
            }
        } 
    };
    if(submitConfig.extraParams)cfg.params=submitConfig.extraParams;
    submitConfig.formPanel.getForm().submit(cfg);
};

function promisLoadException(a,b,c){
	if(c && c.responseText){
		ajaxErrorHandler(eval("("+c.responseText+")"));
	} else Ext.Msg.show({title: getLocMsg('js_bilgi'), msg: getLocMsg('js_no_connection_error'), icon: Ext.MessageBox.INFO});
}

function promisRequest(rcfg){
	var reqWaitMsg = 1*_app.request_wait_msg;	
	if(typeof rcfg.requestWaitMsg == 'boolean'){
		if (rcfg.requestWaitMsg)
			reqWaitMsg=1;
		else 
			reqWaitMsg=0;		
	}		
	if(reqWaitMsg==1)Ext.Msg.wait((rcfg.requestWaitMsg == '' ||typeof rcfg.requestWaitMsg == 'undefined' || typeof rcfg.requestWaitMsg == 'boolean') ? getLocMsg('js_lutfen_bekleyin') : rcfg.requestWaitMsg);
	if(!rcfg.params)rcfg.params={}
	rcfg.params['.w']=_webPageId;
	Ext.Ajax.request(Ext.apply({
	    success: function(a,b,c){
	    	if(reqWaitMsg==1) Ext.Msg.hide();
			if(rcfg.successResponse)
				rcfg.successResponse(a,b,c);
			else try{
				var json = eval("("+a.responseText+")");
				if(json.success){
					if(rcfg.successDs){
						if(!rcfg.successDs.length)
							rcfg.successDs.reload();//rcfg.successDs TODO: onceden bu vardi kaldirdim, sorun cikarsa geri konulur. sebep, delete'ten sonra eski parametrelere gore refresh ediyordu gridi
						else if(rcfg.successDs.length>0){
							for(var qi=0;qi<rcfg.successDs.length;qi++)
								rcfg.successDs[qi].reload(rcfg.successDs[qi]);
						}
					}
					if(rcfg.successCallback)rcfg.successCallback(json,rcfg);
					else if(_app.show_info_msg && 1*_app.show_info_msg!=0) {Ext.infoMsg.msg(getLocMsg('js_tamam'),getLocMsg('js_islem_basariyla_tamamlandi'));}					
				} else {
			    	if(rcfg.noSuccessCallback)rcfg.noSuccessCallback(json,rcfg);
			    	else ajaxErrorHandler(json);
				}
			}catch(e){
				if(1*_app.debug != 0){
	                if(confirm('ERROR promisRequest!!! Throw?'))throw e;
				} else alert('Framework Error(promisRequest)'); //???
			}
		},
	    failure: function(a,b,c){
	    	if(reqWaitMsg==1) Ext.Msg.hide();
			promisLoadException(a,b,c);
		}
	}, rcfg));
}




function combo2combo(comboMaster,comboDetail,param,formAction){//formAction:2(insert) ise ve comboDetail reload olunca 1 kayit geliyorsa otomatik onu sec

	if(typeof comboMaster=='undefined' || typeof comboDetail=='undefined')return;
	if(typeof comboMaster.hiddenValue=='undefined'){
		comboMaster.on('select',function(a,b,c){
			if(comboMaster.getValue()==''){
				comboDetail.clearValue();
				if(comboDetail.getStore())comboDetail.getStore().removeAll();
				comboDetail.fireEvent('select');
				return;
			}
			var p = null;
	        if(typeof param == 'function'){
	        	p = param(comboMaster.getValue(),b);
	        	if(comboDetail._controlTip != 60){
		        	if(!p){
		        		comboDetail.disable();
		        		comboDetail.setValue('');
		        	} else comboDetail.enable();
	        	}else{
	        		comboDetail.clearValue();// Aşırı sıkış
	        	}
	        } else {
	        	p = {};
	            p[param]=comboMaster.getValue();
	        }
			if(p){
				if(typeof comboDetail.hiddenValue=='undefined'){
					comboDetail.store.baseParams=p;
					comboDetail.store.reload({											
						callback:function(ax){
							if(typeof comboDetail._controlTip!='undefined' && (comboDetail._controlTip==16 || comboDetail._controlTip== 60)){//lovcombo-remote
								if(comboDetail._oldValue && comboDetail._oldValue != null){
									comboDetail.setValue(comboDetail._oldValue);
									comboDetail._oldValue=null;
								}								
							} else if((ax && !(ax.length)) || comboMaster.getValue() == ''){
								comboDetail.clearValue();
							} else if(ax && ax.length==1 && (comboDetail.getValue()==ax[0].id || formAction == 2) && !comboDetail._notAutoSet){
								comboDetail.setValue(ax[0].id);
							} else if(ax && ax.length>1 && comboDetail.getValue()){
								if(comboDetail.store.getById(comboDetail.getValue())){
									comboDetail.setValue(comboDetail.getValue());	
								}
								else{
									comboDetail.clearValue();									
								}
							}
							if(comboDetail.getValue())comboDetail.fireEvent('select');
						}
					});
				} else {
					p.xid=comboDetail.hiddenValue;
					promisRequest({url:'ajaxQueryData',params:p,successCallback:function(j2){
						if(j2 && j2.data && j2.data.length)for(var qi=0;qi<j2.data.length;qi++)if(''+j2.data[qi].id==''+comboDetail.hiddenValue){
							comboDetail.setValue('<b>'+j2.data[qi].dsc+'</b>');
						}
					}});
				}
			}else{
			//	alert(2);
			}
		});
		if(comboMaster.getValue())comboDetail.on('afterrender',function(a,b){comboMaster.fireEvent('select');});
	} else {//master hiddenValue
		var p = null;
        if(typeof param == 'function'){
        	p = param(comboMaster.hiddenValue,comboMaster);
        	if(!p){
        		comboDetail.disable();
        		comboDetail.setValue('');
        	} else comboDetail.enable();
        } else {
        	p = {};
            p[param]=comboMaster.hiddenValue;
        }
		if(p){
			if(typeof comboDetail.hiddenValue=='undefined'){
				comboDetail.store.baseParams=p;
				comboDetail.store.reload({
	//				params:p,
					callback:function(ax){
						if(typeof formAction!='undefined' && formAction==2 && ax && ax.length==1){
							comboDetail.setValue(ax[0].id);
						} else if(comboDetail.getValue()){
							comboDetail.setValue(comboDetail.getValue());
						}
						if(comboDetail.getValue())comboDetail.fireEvent('select');
					}
				});
			} else {
				p.xid=comboDetail.hiddenValue;
				promisRequest({url:'ajaxQueryData',params:p,successCallback:function(j2){
					if(j2 && j2.data && j2.data.length)for(var qi=0;qi<j2.data.length;qi++)if(''+j2.data[qi].id==''+comboDetail.hiddenValue){
						comboDetail.setValue('<b>'+j2.data[qi].dsc+'</b>');
					}
				}});
			}
		}
	}
}

function loadCombo(comboMaster,param,formAction){
	if(typeof comboMaster=='undefined' || !param)return;
	if(typeof comboMaster.hiddenValue!='undefined'){
		if(comboMaster._controlTip==101){
			promisRequest({url:'ajaxQueryData',params:param,successCallback:function(j2){
				if(j2 && j2.data && j2.data.length)for(var qi=0;qi<j2.data.length;qi++)if(''+j2.data[qi].id==''+comboMaster.hiddenValue){
					comboMaster.setValue('<b>'+j2.data[qi].dsc+'</b>');
				}
			}});
		}
		return;
	}
	comboMaster.store.reload({
		params:param,
		callback:function(ax){
			if(typeof formAction!='undefined' && formAction==2 && ax && ax.length==1/* && !comboMaster.getValue()*/){comboMaster.setValue(ax[0].id);} 
			else if(comboMaster.getValue() || comboMaster._oldValue)comboMaster.setValue(comboMaster.getValue() || comboMaster._oldValue);
			if(comboMaster.getValue())comboMaster.fireEvent('select');
		}
	});
}

function openModal(cfg){
	mainPanel.loadTab({attributes:{href:cfg.url,modalWindow:true}});
}

function gridQwRenderer(field){
    return function(a,b,c){
        return c.data[field+'_qw_'];
    };
}
function gridQwRendererWithLink(field,tbl_id){
    return function(a,b,c){
        return c.data[field]!=undefined ? '<a href=# onclick="return fnTblRecEdit('+tbl_id+','+c.data[field]+')">'+c.data[field+'_qw_']+'</a>' :'';
    };
}

function gridUserRenderer(field){
    return function(a,b,c){
        return c.data[field]==_scd.userId ? c.data[field+'_qw_'] : '<a href=# onclick="return openChatWindow('+c.data[field]+',\''+c.data[field+'_qw_']+'\',true)">'+c.data[field+'_qw_']+'</a>';
    };
}
function editGridComboRenderer(combo){
    return function(value){
    	if(!combo || !combo.store)return '???';
        var record = combo.store.getById(value);
        return record ? record.get('dsc') : '';
    };
}
function editGridTreeComboRenderer(combo,field){
    return function(value,b,c){
    	if(!combo || !combo.treePanel)return '???';
        var record = combo.treePanel.getNodeById(value);
        if(record)record=record.text;
        else record = (value && value!=0) ? c.data[field+'_qw_'] : '';
        return record;
    };
}

function editGridLovComboRenderer(combo){
	return function(value){ 
    	if(!combo)return '???';
		var valueList = [];
		if(typeof value == 'undefined')return '';
		if(!value && (''+value).length==0)return '';
		var findArr = value.split(',');
		var i, l=findArr.length;
		for (i=0; i<l; i++) {
			if (record = combo.store.getById(findArr[i])) {
				valueList.push(record.get('dsc'));
			}
		}
		return valueList.join(',');
	};
}

function handleMouseDown(g, rowIndex, e){
    if(e.button !== 0 || this.isLocked()){
        return;
    };
    var view = this.grid.getView();
    if(e.shiftKey && this.last !== false){
        var last = this.last;
        this.selectRange(last, rowIndex, e.ctrlKey);
        this.last = last; // reset the last
        view.focusRow(rowIndex);
    }else{
        var isSelected = this.isSelected(rowIndex);
        if(e.ctrlKey && isSelected){
            this.deselectRow(rowIndex);
        }else if(!isSelected || this.getCount() > 1){
            this.selectRow(rowIndex, true);
            view.focusRow(rowIndex);
        }
    }
}

function approveTableRecord(aa,a){
	var sel = a._grid.sm.getSelected();
	var rec_id;
	
	if(!sel){
    	Ext.Msg.alert(getLocMsg('js_bilgi'),getLocMsg('js_once_birseyler_secmelisiniz'));
    	return
    }
    if(aa==2 && 1*sel.data.return_flag==0){
    	Ext.Msg.alert(getLocMsg('js_bilgi'),getLocMsg('js_bu_surecte_iade_yapilamaz'));
    	return
    }     
    
    if (sel.data.approval_record_id){
		rec_id = sel.data.approval_record_id;
	}else{
		rec_id = sel.data.pkpkpk_arf_id;			
	}
    
    var onayMap=['',getLocMsg('js_onayla'),getLocMsg('js_iade_et'),getLocMsg('js_reddet')];
    onayMap[901]=getLocMsg('js_onayi_baslat');
    var caption = onayMap[aa]+' ('+sel.data.dsc+')';
    var e_sign_flag = sel.data.e_sign_flag;
    
    if((1*e_sign_flag == 1) && (aa*1 == 1)){ //
        openPopup('showPage?_tid=691&_arid='+sel.data.approval_record_id,'_blank',800,600,1);                        
        return;            
    }
    
    var urlek='';
    var dynamix = (sel.data.approval_flow_tip*1==3 && aa==901)? true:false;
    if(dynamix)
    	urlek='&xapp_record_id4user_ids='+sel.data.approval_record_id;
    var lvcombo = new Ext.ux.form.LovCombo({
		labelSeparator:'',
		fieldLabel:getLocMsg('dynamic_step_user_ids'), 
		hiddenName: 'approve_user_ids',
		store: new Ext.data.JsonStore({
			url:'ajaxQueryData?_qid=585' + urlek,
			root:'data',
			totalProperty:'browseInfo.totalCount',
			id:'id',
			autoLoad: true,
			fields:[{name:'dsc'},{name:'id',type:'int'}],
			listeners:{loadexception:promisLoadException}
		}),
		valueField:'id',
		displayField:'dsc',
		mode: 'local',
		triggerAction: 'all',
		anchor:'100%'});
	
	if(!dynamix){
		lvcombo.setVisible(false);
	}	
	
	var cform = new Ext.form.FormPanel({
		baseCls: 'x-plain',
		labelWidth: 150,
		frame:false,
		bodyStyle:'padding:5px 5px 0',
		labelAlign: 'top',
		
		items: [lvcombo, {
			xtype: 'textarea',
			fieldLabel: getLocMsg('js_yorumunuzu_girin'),
			name: '_comment',
			anchor: '100% -5'  // anchor width by percentage and height by raw adjustment
		}]
	});
	
	var win = new Ext.Window({
		layout:'fit',
		width:500,
		height:300,
		plain: true,
		buttonAlign:'center',
		modal:true,
		title: caption,
		
		items: cform,
		buttons: [{text:getLocMsg('js_tamam'),
				handler: function(ax,bx,cx){	
					var _dynamic_approval_users = win.items.items[0].items.items[0].getValue();	
					var _comment = win.items.items[0].items.items[1].getValue();
					promisRequest({
						url: 'ajaxApproveRecord',
						params:{_arid:rec_id,_adsc:_comment,_aa:aa, _avno:(sel.data.ar_version_no||sel.data.version_no), _appUserIds:_dynamic_approval_users},
						successDs: a._grid.ds
						,successCallback:aa!=901?win.close():function(){win.close();Ext.Msg.alert(getLocMsg('js_bilgi'),getLocMsg('js_onay_sureci_baslamistir'));}
					});
				}},
				{text:getLocMsg('js_iptal'),
				handler: function(){
					win.close();
				}
			}]
	});
	win.show(this);  
}

function approveTableRecords(aa, a){
	var sels = a._grid.sm.getSelections();

	if(sels.length==0){
		Ext.Msg.show({title: getLocMsg('js_error'), msg: getLocMsg('js_once_birseyler_secmelisiniz'), icon: Ext.MessageBox.ERROR});
    	return
    }
	var tek_kayit = sels.length == 1 ? true : false;
	var sel_ids = [];
	var urlek='';
	var dynamix = false;
	var vers = [];
	var step = 0;
	var rec_id;
	var step_id;

	for (var i=0; i<sels.length; i++){
		if (sels[i].data.approval_record_id){
			rec_id = sels[i].data.approval_record_id;
		}else{
			rec_id = sels[i].data.pkpkpk_arf_id;			
		}
		
		if (sels[i].data.approval_step_id){
			step_id = sels[i].data.approval_step_id;
		}else{
			step_id = sels[i].data.pkpkpk_arf;			
		}				

		if(aa != 901 && step_id == 901){
			Ext.Msg.show({title: getLocMsg('js_error'), msg: getLocMsg('approval_hatali_islem'), icon: Ext.MessageBox.ERROR});
			return;			
		}
		
		if (step!=0 && step_id*1!=step ){
			Ext.Msg.show({title: getLocMsg('js_error'), msg: getLocMsg('js_secilenlerin_onay_adimi_ayni_olmali'), icon: Ext.MessageBox.ERROR});
			return;
		}
		step = step_id;	

		if (step_id*1==998){
			Ext.Msg.show({title: getLocMsg('js_error'), msg: getLocMsg('js_kayit_onaylanmis'), icon: Ext.MessageBox.ERROR});
			return;
		}	
				
		if (step_id<0){
			Ext.Msg.show({title: getLocMsg('js_error'), msg: getLocMsg('js_onay_adiminda_yer_almiyorsunuz'), icon: Ext.MessageBox.ERROR});
			return;
		} 
		
		if (sels[i].data.in_approval_users && sels[i].data.in_approval_roles){
			if (sels[i].data.in_approval_users*1!=1 && sels[i].data.in_approval_roles*1!=1){
				Ext.Msg.show({title: getLocMsg('js_error'), msg: getLocMsg('js_onay_adiminda_yer_almiyorsunuz'), icon: Ext.MessageBox.ERROR});
				return;
			}
		}
		
		if(aa==2 && 1*sels[i].data.return_flag==0){
			Ext.Msg.show({title: getLocMsg('js_error'), msg: getLocMsg('js_bu_surecte_iade_yapilamaz'), icon: Ext.MessageBox.ERROR});
			return
		}      
		var e_sign_flag = sels[i].data.e_sign_flag || 0;
		if((1*e_sign_flag == 1) && (aa*1 == 1) && (tek_kayit == false)){ //
			Ext.Msg.show({title: getLocMsg('js_error'), msg: getLocMsg('js_e_imza_onay_tek_kayit_secilmeli'), icon: Ext.MessageBox.ERROR});
			return;            
		}
		dynamix = (sels[0].data.approval_flow_tip*1==3 && aa==901)? true:false;
		if (dynamix==true && tek_kayit==false){
			Ext.Msg.show({title: getLocMsg('js_error'), msg: getLocMsg('js_dinamik_onay_tek_kayit_secilmeli'), icon: Ext.MessageBox.ERROR});                    
			return;  
		}
		if(dynamix)
			urlek='&xapp_record_id4user_ids='+rec_id;
		if (rec_id*1>0){			
			sel_ids.push(rec_id);
			vers.push(sels[i].data.ar_version_no||sels[i].data.version_no);
		}
	}
    var onayMap=['',getLocMsg('js_onayla'),getLocMsg('js_iade_et'),getLocMsg('js_reddet')];
    onayMap[901]=getLocMsg('js_onayi_baslat');
    var caption = onayMap[aa];
                        
    if(sel_ids.length==0)return;
    
    var lvcombo = new Ext.ux.form.LovCombo({
		labelSeparator:'',
		fieldLabel:getLocMsg('dynamic_step_user_ids'), 
		hiddenName: 'approve_user_ids',
		store: dynamix == true ? (new Ext.data.JsonStore({
			url:'ajaxQueryData?_qid=585' + urlek,
			root:'data',
			totalProperty:'browseInfo.totalCount',
			id:'id',
			autoLoad: true,
			fields:[{name:'dsc'},{name:'id',type:'int'}],
			listeners:{loadexception:promisLoadException}
		})): null,
		valueField:'id',
		displayField:'dsc',
		mode: 'local',
		triggerAction: 'all',
		anchor:'100%'});
	
	if(!dynamix){
		lvcombo.setVisible(false);
	}	
	
	var cform = new Ext.form.FormPanel({
		baseCls: 'x-plain',
		labelWidth: 150,
		frame:false,
		bodyStyle:'padding:5px 5px 0',
		labelAlign: 'top',
		
		items: [lvcombo, {
			xtype: 'textarea',
			fieldLabel: getLocMsg('js_yorumunuzu_girin'),
			name: '_comment',
			anchor: '100% -5'  // anchor width by percentage and height by raw adjustment
		}]
	});
	
	var win = new Ext.Window({
		layout:'fit',
		width:500,
		height:300,
		plain: true,
		buttonAlign:'center',
		modal:true,
		title: caption,
		
		items: cform,
		buttons: [{text:getLocMsg('js_tamam'),
				handler: function(ax,bx,cx){	
					var _dynamic_approval_users = (dynamix == true ? (win.items.items[0].items.items[0].getValue()) : null);	
					var _comment = win.items.items[0].items.items[1].getValue();
					/*promisRequest({
						url: 'ajaxApproveRecord',
						params:{_arids:sel_ids,_adsc:_comment,_aa:aa, _avnos:vers, _appUserIds:_dynamic_approval_users},
						successDs: a._grid.ds
						,successCallback:win.close()
					});*/

					//senkron hale getirildi
					var prms = "";
					for(var i=0; i<sel_ids.length; i++){
						prms +=  '_arids='+sel_ids[i]+'&';
						prms +=  '_avnos='+vers[i]+'&';
					}					
					prms += '_adsc' + '=' + encodeURIComponent(_comment) + '&' + '_aa' + '=' + encodeURIComponent(aa)+ '&' + '_appUserIds' + '=' + encodeURIComponent(_dynamic_approval_users);
					
					Ext.Msg.wait('',getLocMsg('js_lutfen_bekleyin') );
					var request = promisManuelAjaxObject();
					request.open("POST", 'ajaxApproveRecord', false);
					request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					request.send(prms);
					var json = eval("("+request.responseText+")");
					Ext.Msg.hide();
					if(json.success){
						win.close();
						a._grid.ds.reload();
						Ext.infoMsg.msg(getLocMsg('js_tamam'),getLocMsg('js_islem_basariyla_tamamlandi'));			
					} else ajaxErrorHandler(json);
					
				}},
				{text:getLocMsg('js_iptal'),
				handler: function(){
					win.close();
				}
			}]
	});
	win.show(this);  	
}

function submitAndApproveTableRecord(aa, frm, dynamix){
    var caption = null;
    if(aa != null){
    	caption = ['',getLocMsg('js_onayla'),getLocMsg('js_iade_et'),getLocMsg('js_reddet')][aa];
    }
    else{
    	caption = getLocMsg('js_onay_mek_baslat');
    }
    var urlek='';
    if(dynamix)
    	urlek='&xapp_record_id4user_ids='+frm.approval.approvalRecordId;
	var lvcombo = new Ext.ux.form.LovCombo({
		labelSeparator:'',
		fieldLabel:getLocMsg('dynamic_step_user_ids'), 
		hiddenName: 'approve_user_ids',
		store: new Ext.data.JsonStore({
			url:'ajaxQueryData?_qid=585' + urlek,
			root:'data',
			totalProperty:'browseInfo.totalCount',
			id:'id',
			autoLoad: true,
			fields:[{name:'dsc'},{name:'id',type:'int'}],
			listeners:{loadexception:promisLoadException}
		}),
		valueField:'id',
		displayField:'dsc',
		mode: 'local',
		triggerAction: 'all',
		anchor:'100%'});
	
	if(!dynamix){
		lvcombo.setVisible(false);
	}
		
	var cform = new Ext.form.FormPanel({
		baseCls: 'x-plain',
		labelWidth: 150,
		frame:false,
		bodyStyle:'padding:5px 5px 0',
		labelAlign: 'top',
		
		items: [lvcombo, {
			xtype: 'textarea',
			fieldLabel: getLocMsg('js_yorumunuzu_girin'),
			name: '_comment',
			anchor: '100% -5'  // anchor width by percentage and height by raw adjustment
		}]
	});
	
	var win = new Ext.Window({
		layout:'fit',
		width:500,
		height:300,
		plain: true,
		buttonAlign:'center',
		modal:true,
		title: caption,		
		items: cform,
		buttons: [{text:getLocMsg('js_tamam'),
				handler: function(ax,bx,cx){	
					var _dynamic_approval_users = win.items.items[0].items.items[0].getValue();	
					var _comment = win.items.items[0].items.items[1].getValue();
					if((aa==1 && (!_app.form_approval_save_flag || 1*_app.form_approval_save_flag==0)) || frm.viewMode){
		    			var prms = frm.pk;
		    			prms._arid = frm.approval.approvalRecordId;
		    			prms._aa = aa;
		    			prms._adsc = _comment;
		    			prms._avno = frm.approval.versionNo;
		    			promisRequest({
		    				url: 'ajaxApproveRecord',
		    				params:prms,
		    				successCallback:function(json){
		    					win.close();
			    				var submitConfig=frm._cfg;
		    					if(submitConfig._callAttributes){
		    		            	if(submitConfig._callAttributes._grid)submitConfig._callAttributes._grid.ds.reload();
		    		            }
		    					if (submitConfig._closeWindow){
		    		            	submitConfig._closeWindow.destroy();
		    		            }
		    		            else if(submitConfig.modalWindowFormSubmit){
		    		            	submitConfig.tabp.remove(submitConfig.tabp.getActiveTab());          	
		    		            }
		    		            else if (!mainPanel.closeModalWindow() && !submitConfig.dontClose){
		    		            	mainPanel.remove(mainPanel.getActiveTab());
		    		            }		    					
		    				}
		    			});
		    		} else {
		    			if(aa != -1){
							frm._cfg.extraParams=Ext.apply(frm._cfg.extraParams||{},{_arid:frm.approval.approvalRecordId,_aa:aa,_adsc:_comment,_avno:frm.approval.versionNo+1, _appUserIds:_dynamic_approval_users});
		    			}
		    			else{
		    				frm._cfg.extraParams=Ext.apply(frm._cfg.extraParams||{},{_aa:aa,_adsc:_comment});
		    			}
						formSubmit(frm._cfg);
		    		}
					win.close();
				}},
				{text:getLocMsg('js_iptal'),
				handler: function(){
					win.close();
				}
			}]
	});
	win.show(this);    	
}

function addTab4Portal(obj){
	var detailGridPanels = [];
	for(var i=0;i<obj.detailGrids.length;i++){
		if(obj.detailGrids[i].dash){
			var dg = obj.detailGrids[i].dash;
			if(!dg || !dg.dashId)continue;
			if(dg._ready){
				detailGridPanels.push(dg);
				continue;
			}
			var gid = 'dgraph_div_'+dg.dashId;
			var dgPanel =Ext.apply({
				html:'<div id="'+gid+'" style="height:100%;width:100%;background-color:#fff;"></div>',
				header:false, _dg:dg, _gid:gid,
				listeners: {
					'afterrender' : function(aq,bq,cq){
						var dg=aq._dg, gid=aq._gid;
					        var newStat=1*dg.funcTip ? dg.funcFields:'';
						var params={};
						if(newStat)params._ffids=newStat;
						if(1*dg.graphTip>=5)params._sfid=dg.stackedFieldId;
						promisRequest({url:'ajaxQueryData4StatTree?_gid='+dg.gridId+'&_stat='+dg.funcTip+'&_qfid='+dg.groupBy+'&_dtt='+dg.dtTip, params:Ext.apply(params,dg.queryParams), successCallback:function(az){
							
							if(!az.data)az.data=[];
							var resc=1;
							if(1*dg.graphTip<5){
								if(newStat.indexOf(',')>0){
									resc = newStat.split(',').length;
									if(resc>4)resc=4;
									for(var qi=0;qi<az.data.length;qi++){
										az.data[qi].xres=Math.round(1*(az.data[qi].xres ||0));
										for(var zi=2;zi<=resc;zi++){
											az.data[qi]['xres'+zi]=Math.round(1*(az.data[qi]['xres'+zi] ||0));
										}
									}
								} else {
								var colors=["#FF0F00","#FF6600","#FF9E01","#FCD202","#F8FF01","#B0DE09","#04D215","#0D8ECF","#0D52D1","#2A0CD0","#8A0CCF","#CD0D74"];
								for(var qi=0;qi<az.data.length;qi++){az.data[qi].xres=Math.round(1*(az.data[qi].xres ||0));az.data[qi].color=colors[qi % colors.length];}
								}
							} else {
								for(var ki in az.lookUp){
									if(1*dg.graphTip==6)for(var qi=0;qi<az.data.length;qi++){
										az.data[qi]['xres_'+ki]=Math.round(1*(az.data[qi]['xres_'+ki] ||0));
									}
									if(!az.lookUp[ki])az.lookUp[ki]="*"+ki;
								}
							}
							var extraCfg=dg.is3d && 1*dg.graphTip<6 ? {"depth3D": 20, "angle": 30} : {};
							switch(1*dg.graphTip){
							case	6://stacked area
								var graphs=[];
								for(var k in az.lookUp)graphs.push({
									"balloonText": "<b>"+az.lookUp[k]+": [[xres_"+k+"]]</b>",
									"fillAlphas": 0.6,"lineAlpha": 0.2,
									"color": "#000000","title": az.lookUp[k],
									"valueField": "xres_"+k
								});
								if(dg.legend)extraCfg.legend={
									"equalWidths": false, "periodValueText": "total: [[value.sum]]",
									"position": "top", "valueAlign": "left", "valueWidth": 100
								};
								AmCharts.makeChart(gid, Ext.apply(extraCfg,{
								      "type": "serial",
								      "graphs": graphs,"valueAxes": [{
									  "stackType": "regular",
									  "axisAlpha": 0.3,
									  "gridAlpha": 0.2
								      }],
								      "chartCursor": {
									"categoryBalloonEnabled": false,
									"cursorAlpha": 0,
									"zoomable": false
								      },
								      "categoryField": "dsc",
								      "categoryAxis": {
									"labelRotation": 45,
									  "gridPosition": "start",
									  "axisAlpha": 0,
									  "gridAlpha": 0,
									  "position": "left"
								      },
								      "dataProvider":az.data

								}));
								  
								  break;
							
							case	5://stacked column
								var graphs=[];
								for(var k in az.lookUp)graphs.push({
									"balloonText": "<b>"+az.lookUp[k]+": [[xres_"+k+"]]</b>",
									"fillAlphas": 0.9,"lineAlpha": 0.2,
									"type": "column",
									"color": "#000000","title": az.lookUp[k],
									"valueField": "xres_"+k
								});
								if(dg.legend)extraCfg.legend={
									"equalWidths": false, "periodValueText": "total: [[value.sum]]",
									"position": "top", "valueAlign": "left", "valueWidth": 100
								};
								AmCharts.makeChart(gid, Ext.apply(extraCfg,{
								      "type": "serial",
								      "graphs": graphs,"valueAxes": [{
									  "stackType": "regular",
									  "axisAlpha": 0.3,
									  "gridAlpha": 0.2
								      }],
								      "chartCursor": {
									"categoryBalloonEnabled": false,
									"cursorAlpha": 0,
									"zoomable": false
								      },
								      "categoryField": "dsc",
								      "categoryAxis": {
									"labelRotation": 45,
									  "gridPosition": "start",
									  "axisAlpha": 0,
									  "gridAlpha": 0,
									  "position": "left"
								      },
								      "dataProvider":az.data

								}));
								  
								  break;

							case 3:
							if (dg.legend) extraCfg.legend = {"position": "left"};
							  AmCharts.makeChart(gid, Ext.apply(extraCfg,{
							    "type": "pie",
							    "startDuration": 2,
							    "labelRadius": 15,	"labelText": (dg.legend ? "[[percents]]%":"[[dsc]]: [[value]]"),
							    "innerRadius": "50%",

//							     "legend":{"position":"left"}, //","marginRight":100,"autoMargins":false
							      "dataProvider":az.data,
							      "balloonText": "[[dsc]]: [[value]]",
							      "valueField": "xres",
							      "titleField": "dsc"
							  }));
							  break;
							case	1:
							if(resc>1){ //pek cok var
							    var qq=newStat.split(',');
							    var graphs=[{
								  "balloonText": "<b>"+"TODO"/*mf._func_query_field_ids.store.getById(qq[0].split('=')[1]).get('dsc')*/+": [[xres]]</b>",
								  "fillAlphas": 0.9,
								  "lineAlpha": 0.2,
								  "type": "column",
								  "valueField": "xres"
								}];
								for(var zi=2;zi<=resc;zi++)graphs.push({
								  "balloonText": "<b>"+"TODO"/*mf._func_query_field_ids.store.getById(qq[zi-1]).get('dsc')*/+": [[xres"+zi+"]]</b>",
								  "fillAlphas": 0.9,
								  "lineAlpha": 0.2,
								  "type": "column",
								  "valueField": "xres"+zi
								});
							    AmCharts.makeChart(gid, Ext.apply(extraCfg,{
							      "type": "serial",
							      "startDuration": 2,
							      "graphs": graphs,
							      "chartCursor": {
								"categoryBalloonEnabled": false,
								"cursorAlpha": 0,
								"zoomable": false
							      },
							      "categoryField": "dsc",
							      "categoryAxis": {
								"gridPosition": "start",
								"labelRotation": 45
							      },
							      "dataProvider":az.data
							    }));
							      
							  } else
							  AmCharts.makeChart(gid, Ext.apply(extraCfg,{
							    "type": "serial",
							    "startDuration": 2,
							    "graphs": [{
							      "balloonText": "<b>[[dsc]]: [[xres]]</b>",
							      "fillColorsField": "color",
							      "fillAlphas": 0.9,
							      "lineAlpha": 0.2,
							      "type": "column",
							      "valueField": "xres"
							    }],
							    "chartCursor": {
							      "categoryBalloonEnabled": false,
							      "cursorAlpha": 0,
							      "zoomable": false
							    },
							    "categoryField": "dsc",
							    "categoryAxis": {
							      "gridPosition": "start",
							      "labelRotation": 45
							    },
							    "dataProvider":az.data
							  }));
							  break;
						      }
						    
						  }});
					}
				}
				,handlerSetting:function(aq,bq,cq){
					mainPanel.loadTab({
					    attributes: {
						_title_: cq._gp.name,
						modalWindow: true,
						href: 'showForm?a=1&_fid=327&tgraph_dashboard_id='+cq._gp.dashId
					    }
					})
				}
			},dg);
			var p=new Ext.Panel(dgPanel);
			dgPanel._gp=p;//dgPanel.gridId=-dg.dashId;
			detailGridPanels.push(p);
		} else {
			var detailGrid = obj.detailGrids[i].grid;
			if(!detailGrid || !detailGrid.gridId)continue;
			if(detailGrid._ready){
				detailGridPanels.push(detailGrid);
				continue;
			}
			if(obj.detailGrids[i].pk)detailGrid._pk = obj.detailGrids[i].pk;
			var grdExtra={
				stripeRows: true,id:obj.t+'-'+detailGrid.gridId,
				autoScroll:true, clicksToEdit: 1*_app.edit_grid_clicks_to_edit};
			var buttons=[];
			if(detailGrid.editGrid)addDefaultCommitButtons(buttons, detailGrid);	
			
			if(detailGrid.hasFilter){
				    if(buttons.length>0)buttons.push('-');
				    buttons.push({tooltip:getLocMsg('js_filtreyi_kaldir'),cls:'x-btn-icon x-grid-funnel',_grid:detailGrid, handler:fnClearFilters});
			}
			
			if(detailGrid.crudFlags)addDefaultCrudButtons(buttons, detailGrid);
			if(detailGrid.moveUpDown)addMoveUpDownButtons(buttons, detailGrid);
			addDefaultSpecialButtons(buttons, detailGrid);

			if(detailGrid.extraButtons){
				if(buttons.length>0)buttons.push('-');
				for(var j=0;j<detailGrid.extraButtons.length;j++){
					detailGrid.extraButtons[j]._grid=detailGrid;
					detailGrid.extraButtons[j].disabled=detailGrid.extraButtons[j]._activeOnSelection;
				}
				buttons.push(detailGrid.extraButtons);
			}
			 if(detailGrid.menuButtons){
				for(var j=0;j<detailGrid.menuButtons.length;j++){
					detailGrid.menuButtons[j]._grid=detailGrid;
				}
				detailGrid.menuButtons = new Ext.menu.Menu({enableScrolling:false, items:detailGrid.menuButtons});
				if(1*_app.toolbar_edit_btn){
					if(buttons.length>0)buttons.push('-');
					buttons.push({id: 'btn_operations_' + detailGrid.id, tooltip:getLocMsg('js_islemler'),cls:'x-btn-icon x-grid-menu', disabled:true, _activeOnSelection:true, menu: detailGrid.menuButtons});
				}
			}
			if(detailGrid.gridReport)addDefaultReportButtons(buttons, detailGrid);
			addDefaultPrivilegeButtons(buttons,detailGrid);
				
			if(detailGrid.pageSize){ // paging'li toolbar
				var tbarExtra = {xtype:'paging', store: detailGrid.ds, pageSize: detailGrid.pageSize, displayInfo: detailGrid.displayInfo};
				if(buttons.length>0)tbarExtra.items=organizeButtons(buttons);
				grdExtra.tbar=tbarExtra;
			} else if(buttons.length>0){//standart toolbar
				grdExtra.tbar=organizeButtons(buttons);
			}
			var eg = detailGrid.master_column_id ? (detailGrid.editGrid ? Ext.ux.maximgb.tg.EditorGridPanel : Ext.ux.maximgb.tg.GridPanel) : (detailGrid.editGrid ? Ext.grid.EditorGridPanel : Ext.grid.GridPanel);
			var detailGridPanel = new eg(Ext.apply(detailGrid,grdExtra));
			if(detailGrid.crudFlags && detailGrid.crudFlags.edit)detailGridPanel.on('rowdblclick',fnRowEditDblClick);

			detailGrid._gp=detailGridPanel;
			if(detailGrid.editGrid){
				detailGridPanel.getColumnModel()._grid=detailGrid;
				if(!detailGrid.onlyCommitBtn){
					detailGridPanel.getColumnModel().isCellEditable=function(colIndex,rowIndex){
						if(this._grid._isCellEditable && this._grid._isCellEditable(colIndex,rowIndex,this._grid)===false)return false;
						return this._grid.editMode;
					}
				} else if(detailGrid._isCellEditable)mainGridPanel.getColumnModel().isCellEditable=function(colIndex,rowIndex){
					return this._grid._isCellEditable(colIndex,rowIndex,this._grid);
				}
			}

			if(detailGrid.menuButtons/* && !1*_app.toolbar_edit_btn*/){
				detailGridPanel.messageContextMenu = detailGrid.menuButtons;
				detailGridPanel.on('rowcontextmenu', fnRightClick);
			}

			if(buttons.length>0){
				detailGridPanel.getSelectionModel().on("selectionchange",function(a,b,c){
					if(!a || !a.grid)return;
					var titems = a.grid.getTopToolbar().items.items;
					for(var ti=0;ti<titems.length;ti++){
						if(titems[ti]._activeOnSelection)
							titems[ti].setDisabled(!a.hasSelection());
					}

				});
			}
			detailGridPanels.push(detailGridPanel);
		}
	} 
	return detailGridPanels;
}
function fnRowInsert2(a,b){
	var ex = new a._grid.record(Ext.apply({},a._grid.initRecord));
	a._grid._insertedItems[ex.id]=true;
	ex.markDirty();
	var gp=Ext.getCmp(a._grid.id)
	gp.stopEditing();
	var insertIndex = !a._grid._insertAtLastIndex || !gp.getStore().data.items.length ? 0 : gp.getStore().data.items.length;
	gp.getStore().insert(insertIndex, ex);
	gp.getView().refresh();
	gp.getSelectionModel().selectRow(insertIndex);
	gp.startEditing(insertIndex,typeof a._grid._startEditColumn=='undefined' ? 1:a._grid._startEditColumn);
};


function fnRowDelete2(a,b){
	var sel=a._grid.sm.getSelected();
	if(!sel)return;
	if(a._grid._deleteControl && a._grid._deleteControl(sel,a._grid)==false){
		return;
	}
	if(a._grid._insertedItems[sel.id]){
		a._grid._insertedItems[sel.id]=false;
	}else{
		var delItem={};
		for(var key in a._grid._pk)delItem[key]=sel.data[a._grid._pk[key]];
		a._grid._deletedItems.push(delItem);
	}
	var ds=a._grid.ds || a._grid.store;
	var io=ds.indexOf(sel);
	ds.remove(sel);
	if(ds.getCount()>0){
		if(io>=ds.getCount())io=ds.getCount()-1;
		a._grid.sm.selectRow(io,false);
	}
};

function prepareParams4grid(grid, prefix){
  	var dirtyCount=0;
  	var params={};
	var items = grid._deletedItems;
  	if(items)for(var bjk=0;bjk<items.length;bjk++){ //deleted
  		dirtyCount++;
  		for(var key in items[bjk])params[key+prefix+"."+dirtyCount]=items[bjk][key];
  		params["a"+prefix+"."+dirtyCount]=3;
  	}
	items = grid.ds.data.items;
	var pk = grid._pk;
	if(items)for(var bjk=0;bjk<items.length;bjk++)if(items[bjk].dirty || grid._insertedItems[items[bjk].id]){ // edited&inserted
		dirtyCount++;
		for(var key in pk){
			var val=pk[key];
			if(typeof val == 'function'){
				params[key+prefix+"."+dirtyCount] = val(items[bjk].data);
			} else {
				params[key+prefix+"."+dirtyCount]=(val.charAt(0)=='!') ? val.substring(1):items[bjk].data[val];
			}
			
		}
		var changes=items[bjk].getChanges();
		for(var key in changes)params[key+prefix+"."+dirtyCount]=changes[key];
		if(grid._insertedItems[items[bjk].id]){
			params["a"+prefix+"."+dirtyCount]=2;
			if(grid._postMap)for(var key in grid._postMap){
				var val = grid._postMap[key];
				if(typeof val == 'function'){
					params[key+prefix+"."+dirtyCount] = val(items[bjk].data);
				} else {
					params[key+prefix+"."+dirtyCount]=(val.charAt(0)=='!') ? val.substring(1):items[bjk].data[val];
				}
			}
			if(grid._postInsertParams){
				for(var key in grid._postInsertParams)params[key+prefix+"."+dirtyCount]=grid._postInsertParams[key];
			}
			// Burada değişiklik var 29.06.2016
            // detayın - detayı
            if(items[bjk].children){
            	for(var i=1;i<=items[bjk].children.length;i++){
                	params["a"+prefix+"."+dirtyCount+"_"+i+"."+1] = 2;
            		for(var key in items[bjk].children[i-1]){
                    	params[key+prefix+"."+dirtyCount+"_"+i+"."+1] = items[bjk].children[i-1][key];
                	}
                }
            }			
		} else {
			params["a"+prefix+"."+dirtyCount]=1;
		}
	}
	if(dirtyCount>0){
		params['_cnt'+prefix]=dirtyCount;
		params['_fid'+prefix]=grid.crudFormId;
		return params;
	} else return {};
}

function prepareParams4gridINSERT(grid, prefix){//sadece master-insert durumunda cagir. farki _postMap ve hic bir zaman _insertedItems,_deletedItems dikkate almamasi
	var dirtyCount=0;
	var params={};
  	var dirtyCount=0;
	var items = grid.ds.data.items;
	if(items)for(var bjk=0;bjk<items.length;bjk++){ // inserted
		dirtyCount++;
		if(grid._postMap)for(var key in grid._postMap){
			var val = grid._postMap[key];
			if(typeof val == 'function'){
				params[key+prefix+"."+dirtyCount] = val(items[bjk].data);
			} else {
				params[key+prefix+"."+dirtyCount]=(val.charAt(0)=='!') ? val.substring(1):items[bjk].data[val];
			}
		}
		params["a"+prefix+"."+dirtyCount]=2;
		if(grid._postInsertParams){
			for(var key in grid._postInsertParams)params[key+prefix+"."+dirtyCount]=grid._postInsertParams[key];
		}
	}
	if(dirtyCount>0){
		params['_cnt'+prefix]=dirtyCount;
		params['_fid'+prefix]=grid.crudFormId;
		return params;
	} else return {};
}


function prepareDetailGridCRUDButtons(grid,pk,toExtraButtonsFlag){
	function add_menu(){
		if(grid.menuButtons){
	    	for(var j=0;j<grid.menuButtons.length;j++){
	    		grid.menuButtons[j]._grid=grid;
	        }
	    	grid.menuButtons = new Ext.menu.Menu({enableScrolling:false, items:grid.menuButtons});
	        if(1*_app.toolbar_edit_btn){
	        	if(buttons.length>0)buttons.push('-');
	        	buttons.push({id: 'btn_operations_' + grid.id, tooltip:getLocMsg('js_islemler'),cls:'x-btn-icon x-grid-menu', menu: grid.menuButtons});
	        }
	        grid.messageContextMenu = grid.menuButtons;
	        if(!grid.listeners)grid.listeners={}
	        grid.listeners.rowcontextmenu=fnRightClick;
	        
	    }
	}
	if(pk)grid._pk=pk;
	var buttons=[];
	grid._insertedItems={};

	if (grid.crudFlags){
		if(grid.crudFlags.insertEditMode){
			buttons.push({tooltip:getLocMsg('js_add'),cls:'x-btn-icon x-grid-new', _grid:grid, handler:fnRowInsert2});
		}
		if(grid.crudFlags.remove){
			buttons.push({tooltip:getLocMsg('js_delete'),cls:'x-btn-icon x-grid-delete', _grid:grid, handler:fnRowDelete2});
			grid._deletedItems=[];
		}
		if(grid.crudFlags.ximport){
			if(typeof grid.crudFlags.ximport=='object' && typeof grid.crudFlags.ximport.length!='undefined'){
				var xmenu=[];
				for(var qi=0;qi<grid.crudFlags.ximport.length;qi++)if(!grid.crudFlags.ximport[qi].dsc)xmenu.push(grid.crudFlags.ximport[qi]); else {
					xmenu.push({text:grid.crudFlags.ximport[qi].dsc,cls:grid.crudFlags.ximport[qi].cls || '', _activeOnSelection:false, _grid:grid, ximport:grid.crudFlags.ximport[qi],handler:fnTableImport});
				}
				if(grid.extraButtons){
					var bxx=xmenu.length>0;
					for(var qi=0;qi<grid.extraButtons.length;qi++)if(grid.extraButtons[qi] && grid.extraButtons[qi].ref && grid.extraButtons[qi].ref.indexOf('../import_')==0){
						if(bxx){bxx=false;xmenu.push('-');}
						grid.extraButtons[qi]._grid=grid;
						xmenu.push(grid.extraButtons[qi]);
						grid.extraButtons.splice(qi,1);qi--;
					}
					if(grid.extraButtons.length==0)grid.extraButtons=undefined;
				}
				buttons.push({tooltip:getLocMsg('js_diger_kayitlardan_aktar'), cls:'x-btn-icon x-grid-import', _activeOnSelection:false, _grid:grid, menu:xmenu});
			} else
				buttons.push({tooltip:getLocMsg('js_diger_kayitlardan_aktar'), cls:'x-btn-icon x-grid-import', _activeOnSelection:false, _grid:grid, handler:fnTableImport});			
		}
	}
	
	if(buttons.length>0){
		if(toExtraButtonsFlag){
			if(grid.extraButtons){
				buttons.push('-');
				buttons.push(grid.extraButtons);
			}
			grid.extraButtons=buttons;			
		} else {
			if(grid.extraButtons && grid.extraButtons.length>0){
				buttons.push('-');
				buttons.push(grid.extraButtons);
			}
			add_menu();
			if(grid.gridReport)addDefaultReportButtons(buttons, grid);
			if(!grid.noPrivilegeButtons)addDefaultPrivilegeButtons(buttons,grid);
			grid.tbar=buttons;
		}
	} else if(!toExtraButtonsFlag){
		if(grid.extraButtons && grid.extraButtons.length>0)buttons.push(grid.extraButtons);
		add_menu();
		if(grid.gridReport)addDefaultReportButtons(buttons, grid);
		if(!grid.noPrivilegeButtons)addDefaultPrivilegeButtons(buttons,grid);
		grid.tbar=buttons;
	}
/*	grid.ds.on('beforeload',function(){
		
	});*/
}


//Multi Main Grid
function addTab4DetailGridsWSearchForm(obj){
	var mainGrid = obj.detailGrids[0].grid,detailGridTabPanel=null;
	var searchFormPanel=  new Ext.FormPanel(Ext.apply(mainGrid.searchForm.render(),{
		region: 'north', bodyStyle:'padding:3px',
//		height: mainGrid.searchForm.defaultHeight||120,
		autoHeight:true,
		anchor: '100%',
		collapsible:true,
		title:mainGrid.searchForm.name,
		border: false,
		keys:{key:13,fn:function(ax,bx,cx){		
		detailGridTabPanel.getActiveTab().store.reload();		
		}}
	}));
	
    //--standart beforeload, ondbliclick, onrowcontextmenu


	//detail tabs
	var detailGridPanels = [];
	for(var i=0;i<obj.detailGrids.length;i++){
		if(obj.detailGrids[i].detailGrids){//master/detail olacak
			obj.detailGrids[0].grid.searchForm=undefined;
			var xmxm=addTab4GridWSearchFormWithDetailGrids(obj.detailGrids[i]);
			if(xmxm.items.items[0].xtype=='form'){ //ilk sıradaki gridin ,detail gridi varsa Search Formunu yok ediyor
				xmxm.items.items[0].destroy();	
			}
	
			var detailGridPanel=xmxm.items.items[0].items.items[0];
			xmxm.store=detailGridPanel.store;			
	        detailGridPanel.store._formPanel = searchFormPanel;
	        detailGridPanel.store._grid = mainGrid;
	        detailGridPanel.store.on('beforeload',function(a,b){
				if(a._grid.editMode)a._grid._deletedItems=[];
				if(a && a._formPanel.getForm())a.baseParams = Ext.apply(a._grid._baseParams || {},a._formPanel.getForm().getValues());//a._formPanel.getForm().getValues();
			});	        
	        xmxm.closable=false;	     
			detailGridPanels.push(xmxm);
			
		} else {
			var detailGrid = obj.detailGrids[i].grid;
			if(!detailGrid || !detailGrid.gridId)continue;
			detailGrid._masterGrid = mainGrid;
			if(detailGrid._ready){
				detailGridPanels.push(detailGrid);
				continue;
			}
			if(obj.detailGrids[i].pk)detailGrid._pk = obj.detailGrids[i].pk;
			var grdExtra={
				title:obj.detailGrids[i]._title_||detailGrid.name,stripeRows: true,id:'gr'+Math.random(),
				autoScroll:true, clicksToEdit: 1*_app.edit_grid_clicks_to_edit};
			var buttons=[];
	
	   		if(detailGrid.editGrid)addDefaultCommitButtons(buttons, detailGrid);	
			
			if(detailGrid.detailView && detailGrid.detailDlg){ //selectionMode:5
	            buttons.push({tooltip:getLocMsg('js_detay_penceresi'), cls:'x-btn-icon x-grid-dpencere', _grid:detailGrid, handler: fnShowDetailDialog});
			}
			
			if(detailGrid.hasFilter){
				    if(buttons.length>0)buttons.push('-');
				    buttons.push({tooltip:getLocMsg('js_filtreyi_kaldir'),cls:'x-btn-icon x-grid-funnel',_grid:detailGrid, handler:fnClearFilters});
			}
			
			if(detailGrid.crudFlags)addDefaultCrudButtons(buttons, detailGrid);
			if(detailGrid.moveUpDown)addMoveUpDownButtons(buttons, detailGrid);
			addDefaultSpecialButtons(buttons, detailGrid);
	
	
	         if(detailGrid.extraButtons){
	             if(buttons.length>0)buttons.push('-');
	             for(var j=0;j<detailGrid.extraButtons.length;j++){
	            	 detailGrid.extraButtons[j]._grid=detailGrid;
	            	 detailGrid.extraButtons[j].disabled=detailGrid.extraButtons[j]._activeOnSelection;
	             }
	             buttons.push(detailGrid.extraButtons);
	         }
	         if(detailGrid.menuButtons){
	         	for(var j=0;j<detailGrid.menuButtons.length;j++){
	         		detailGrid.menuButtons[j]._grid=detailGrid;
	             }
	         	detailGrid.menuButtons = new Ext.menu.Menu({enableScrolling:false, items:detailGrid.menuButtons});
	             if(1*_app.toolbar_edit_btn){
	             	if(buttons.length>0)buttons.push('-');
	             	buttons.push({id: 'btn_operations_' + detailGrid.id, tooltip:getLocMsg('js_islemler'),cls:'x-btn-icon x-grid-menu', disabled:true, _activeOnSelection:true, menu: detailGrid.menuButtons});
	             }
	         }
	 		if(detailGrid.gridReport)addDefaultReportButtons(buttons, detailGrid);
	 		addDefaultPrivilegeButtons(buttons,detailGrid);

	 		
	         if(detailGrid.pageSize){ // paging'li toolbar
	             var tbarExtra = {xtype:'paging', store: detailGrid.ds, pageSize: detailGrid.pageSize, displayInfo: detailGrid.displayInfo};
	             if(buttons.length>0)tbarExtra.items=organizeButtons(buttons);
	             grdExtra.tbar=tbarExtra;
	         } else if(buttons.length>0){//standart toolbar
	             grdExtra.tbar=organizeButtons(buttons);
	         }
	
	        var eg = detailGrid.master_column_id ? (detailGrid.editGrid ? Ext.ux.maximgb.tg.EditorGridPanel : Ext.ux.maximgb.tg.GridPanel) : (detailGrid.editGrid ? Ext.grid.EditorGridPanel : Ext.grid.GridPanel);
			var detailGridPanel = new eg(Ext.apply(detailGrid,grdExtra));
			detailGrid._gp=detailGridPanel;
		    if(detailGrid.editGrid){
		    	detailGridPanel.getColumnModel()._grid=detailGrid;
		    	if(!detailGrid.onlyCommitBtn){
		    		detailGridPanel.getColumnModel().isCellEditable=function(colIndex,rowIndex){
		    			if(this._grid._isCellEditable && this._grid._isCellEditable(colIndex,rowIndex,this._grid)===false)return false;
		    			return this._grid.editMode;
		    		};
		    	} else if(detailGrid._isCellEditable)mainGridPanel.getColumnModel().isCellEditable=function(colIndex,rowIndex){
					return this._grid._isCellEditable(colIndex,rowIndex,this._grid);
				};
		    }
	
			if(detailGrid.menuButtons/* && !1*_app.toolbar_edit_btn*/){
				detailGridPanel.messageContextMenu = detailGrid.menuButtons;
				detailGridPanel.on('rowcontextmenu', fnRightClick);
	        }
	/*	    if(detailGrid.saveUserInfo)detailGridPanel.on("afterrender",function(a,b,c){
				detailGridPanel.getView().hmenu.add('-',{text: 'Mazgal Ayarları',cls:'grid-options1',menu: {items:[{text:'Mazgal Ayarlarını Kaydet',handler:function(){saveGridColumnInfo(grid.getColumnModel(),mainGrid.gridId)}},
			    	                                                                                       {text:'Varsayılan Ayarlara Dön',handler:function(){resetGridColumnInfo(mainGrid.gridId)}}]}});
		    }); */
			if(detailGridPanel.crudFlags && detailGridPanel.crudFlags.edit/* && 1*_app.toolbar_edit_btn*/){detailGridPanel.on('rowdblclick',fnRowEditDblClick);}
	//		grid2grid(mainGridPanel,detailGridPanel,obj.detailGrids[i].params);
			detailGridPanel.store._formPanel = searchFormPanel;
			detailGridPanel.store.on('beforeload',function(a,b){
				if(a._grid.editMode)a._grid._deletedItems=[];
				if(a && a._formPanel.getForm())a.baseParams = Ext.apply(a._grid._baseParams || {},a._formPanel.getForm().getValues());//a._formPanel.getForm().getValues();
			});
	
			
	        if(buttons.length>0){
	        	detailGridPanel.getSelectionModel().on("selectionchange",function(a,b,c){
	        		if(!a || !a.grid)return;
	        		var titems = a.grid.getTopToolbar().items.items;
	        		for(var ti=0;ti<titems.length;ti++){
	        			if(titems[ti]._activeOnSelection)
	        				titems[ti].setDisabled(!a.hasSelection());
	        		}
	        	});
	        }
	        detailGridPanel.store._formPanel = searchFormPanel;
	        detailGridPanel.store._grid = mainGrid;
	        detailGridPanel.store.on('beforeload',function(a,b){
				if(a._grid.editMode)a._grid._deletedItems=[];
				if(a && a._formPanel.getForm())a.baseParams = Ext.apply(a._grid._baseParams || {},a._formPanel.getForm().getValues());//a._formPanel.getForm().getValues();
			});

			detailGridPanels.push(detailGridPanel);
		}
	} 
	detailGridTabPanel =new Ext.TabPanel({
		region:'center',
		enableTabScroll:true,
		activeTab:0,
		visible:false,
		items:detailGridPanels
	});
    var p = {
	    layout: 'border',
        title: obj._title_||mainGrid.name,
//        id: obj.id||'x'+new Date().getTime(),
        border: false,
        closable:true,
        items:[searchFormPanel,detailGridTabPanel]
    };
//    p.iconCls='icon-cmp';
    p = new Ext.Panel(p);
	p._windowCfg = {layout:'border'};
    return p;
}

var lastNotificationCount = 0;
function promisUpdateNotifications(obj){
	if(!obj || typeof obj.new_notification_count=='undefined')return;
	var newCount=1*obj.new_notification_count;
	if(lastNotificationCount!=newCount){
		var ctrl=Ext.getCmp('id_not_label');
		if(ctrl){
			if(newCount==0)ctrl.hide();
			else {ctrl.show();ctrl.setText(newCount);}
			lastNotificationCount=newCount;
		}
	}
}
/* DEPRECATED
function check4Notifications(nt){
	promisRequest({
		url:'ajaxQueryData?_qid=1488', 
		requestWaitMsg:false, 
		timeout:120000,
		params:{},
		successCallback: function(json){
			promisUpdateNotifications({new_notification_count:json.data[0].new_notifications});	
		}
	});
}
*/

function renderParentRecords(rs,sp){
	var ss='',r=null;
	if (!sp)sp=1;
	if(rs && rs.length && rs.length>=(sp)){
		for(var qi=rs.length-1;qi>=0;qi--){
			r=rs[qi];
			if(qi!=rs.length-1)ss+='<br>';
			for(var zi=rs.length-1;zi>qi;zi--)ss+=' &nbsp; &nbsp;';
			ss+='&gt '+(qi!=0 ? (r.tdsc) : ('<b>'+r.tdsc+'</b>'));
			if(r.dsc)ss+=(qi!=0 ? ': <a href=# onclick="return fnTblRecEdit('+r.tid+','+r.tpk+');">'+r.dsc+'</a>':': <b><a href=# onclick="return fnTblRecEdit('+r.tid+','+r.tpk+');">'+r.dsc+'</a></b>');// else ss+=': (...)';
		}
	}
	if(ss){
		ss='<div class="dfeed">'+ss+'</div>';
		if(r && r.tcc && r.tcc>0)ss+=' · <a href=# onclick="return fnTblRecComment('+r.tid+','+r.tpk+');">Yorumlar ('+r.tcc+')</a>';
	}
	return ss;
}


function renderParentRecords2(rs,sp){//TODO: bizzat java 'ya gore
	var ss='',r=null;
	if (!sp)sp=1;
	if(rs && rs.length && rs.length>(sp)){
		for(var qi=rs.length-1;qi>=0;qi--){
			r=rs[qi];
			if(qi!=rs.length-1)ss+='<br>';
			for(var zi=rs.length-1;zi>qi;zi--)ss+=' &nbsp; &nbsp;';
			ss+='&gt '+(qi!=0 ? (r._tableStr) : ('<b>'+r._tableStr+'</b>'));
			if(r.recordDsc)ss+=(qi!=0 ? ': <a href=# onclick="return fnTblRecEdit('+r.tableId+','+r.tablePk+');">'+r.recordDsc+'</a>':': <b><a href=# onclick="return fnTblRecEdit('+r.tableId+','+r.tablePk+');">'+r.recordDsc+'</a></b>');// else ss+=': (...)';
		}
	}
	if(ss){
		ss='<div class="dfeed">'+ss+'</div>';
		if(r && r.commentCount && r.commentCount>0)ss+=' · <a href=# onclick="return fnTblRecComment('+r.tableId+','+r.tablePk+');">Yorumlar ('+r.commentCount+')</a>';
	}
	return ss;
}

function manuelDateValidation(date1, date2, blankControl, dateControl){
	if (blankControl){
		//tarih alanlarının boş olup olmadığı kontrol ediliyor
		if (typeof date1!='undefined'){
			if (date1.allowBlank == false && date1.getValue() == ''){
				Ext.Msg.alert(getLocMsg('js_hata'), getLocMsg('js_blank_text') +' (' + date1.fieldLabel + ')');
				return false;
			}
		}
		
		if (typeof date2!='undefined'){
			if (date2.allowBlank == false && date2.getValue() == ''){
				Ext.Msg.alert(getLocMsg('js_hata'), getLocMsg('js_blank_text') + ' (' + date2.fieldLabel + ')');
				return false;
			}
		}
	}
		
	if (dateControl && typeof date1!='undefined' && typeof date2!='undefined'){
		//birinci tarih ikinci tarihten küçük yada eşit olup olmadığı kontrol ediliyor
		if (date1.getValue()>date2.getValue()){
			Ext.Msg.alert(getLocMsg('js_hata'), getLocMsg('js_error_first_cannot_greater_than_second'));//'İlk Tarih İkinci Tarihten Büyük Olamaz'
			return false;		
		}		
	}
	return true;
}

/*
 * LovCombo içerisinde aranan değerler seçili mi ?
 */

function checkIncludedLovCombo(search_ids, checked_ids){
	var result = false;
	var xsearch_ids = search_ids.split(',');
	var xchecked_ids = checked_ids.split(',');
	
	for(var i=0; i<xchecked_ids.length; i++){
		for(var j=0; j<xsearch_ids.length; j++){
			if(xchecked_ids[i] == xsearch_ids[j]){
				result = true;
				break;
			}
		}		
	}
	return result;
}

/*
 * Field value böyle alınmalı
 */

function getFieldValue(field){
	if(field)return field._controlTip != 101 ? field.getValue() : field.hiddenValue;
	else return null;
}

function setFieldValue(field,value){
	if(field){
		if(field._controlTip != 101)field.setValue(value); 
		else {field.hiddenValue=value;field.setRawValue(value);}
	}
}

/*
 * Eğer displayfield ise event tetiklenmeyecek ama fonksiyon çalışacak,
 * Displayfield değil ise event tetiklenerek fonksiyon çalışacak
 */

function applyEvent2Field(field, event, func, triggerOnRender){
	if(field){
		if(field._controlTip == 101){
			func();
		}
		else{
			field.on(event, function(){func();});
			if(triggerOnRender)field.fireEvent(event);
		}
	}
}

function findInvalidFields(bf){
    var result = [], it = bf.items.items, l = it.length, i, f;
    for (i = 0; i < l; i++) {
        if(!(f = it[i]).disabled && !f.isValid()){
            result.push(f);
        }
    }
    return result;
}


function getSimpleCellMap(cells){
	var jsMap = {}
	if(!cells || !cells.length)return jsMap;
	for(var qi=0;qi<cells.length;qi++){
		jsMap[cells[qi].id]=cells[qi];
	}
	return jsMap;
}

function timeDifDt(cd, timeTip, timeDif){
	if(timeDif){
        var tq = timeDif.split(":");
        if(tq.length>1){
            var tz = tq[0]*60*60*1000 + tq[1]*60*1000;
            if(tq.length>2)tz+=tq[2]*1000;
            switch(timeTip){
            case    0:cd.setHours(0,0,0,0);cd = new Date(cd.getTime() + tz);break;
            case    1:cd = new Date(cd.getTime() + tz);break;
            case    2:cd = new Date(cd.getTime() - tz);break;
            }
        }
    }
	return cd;
}

function fileNameRender(a,b,c){
	var externalUrl = (c.data.external_url ? c.data.external_url:'');
	if( _app.file_attach_view_access_flag && 1*_app.file_attach_view_access_flag && _app.file_attach_view_file_tips && _app.file_attach_view_roles && c.data.file_type_id
	&& (","+_app.file_attach_view_file_tips+",").indexOf(","+c.data.file_type_id+",") > -1 && (","+_app.file_attach_view_roles+",").indexOf(","+_scd.roleId+",") > -1){
		if(externalUrl.length > 5)
			return '<a target=_blank href='+externalUrl+' onclick="return openPopup(\''+externalUrl+'\',\'1\',800,600,1);"><b style="color:green">'+a+'</b></a>'
		else
			return '<a target=_blank href=# onclick="return openPopup(\'showPage?_tid=975&_fai='+c.data.file_attachment_id+'\',\'1\',800,600,1);"><b style="color:#F00">'+a+'</b></a>'
		
	} else{
		if(externalUrl.length > 5)
			return '<a target=_blank href='+externalUrl+' onclick="return openPopup(\''+externalUrl+'\',\'1\',800,600,1);"><b style="color:green">'+a+'</b></a>'
		else
			return '<a target=_blank href="dl/'+encodeURIComponent(a)+'?_fai='+c.data.file_attachment_id+'"><b>'+a+'</b></a>';
		
	}
}

function fileNameRenderWithParent(a,b,c){
	var externalUrl = (c.data.external_url ? c.data.external_url:'');
	if( _app.file_attach_view_access_flag && 1*_app.file_attach_view_access_flag && _app.file_attach_view_file_tips && _app.file_attach_view_roles && c.data.file_type_id
	&& (","+_app.file_attach_view_file_tips+",").indexOf(","+c.data.file_type_id+",") > -1 && (","+_app.file_attach_view_roles+",").indexOf(","+_scd.roleId+",") > -1){
		if(externalUrl.length > 5)
			return '<a target=_blank href='+externalUrl+' onclick="return openPopup(\''+externalUrl+'\',\'1\',800,600,1);"><b style="color:green">'+a+'</b></a>'+ (c.data._record ?  renderParentRecords(c.data._record) : '');
		else
			return '<a target=_blank href=# onclick="return openPopup(\'showPage?_tid=975&_fai='+c.data.file_attachment_id+'\',\'1\',800,600,1);"><b style="color:#F00">'+a+'</b></a>'
		
	} else{
		if(externalUrl.length > 5)
			return '<a target=_blank href='+externalUrl+' onclick="return openPopup(\''+externalUrl+'\',\'1\',800,600,1);"><b style="color:green">'+a+'</b></a>'+ (c.data._record ?  renderParentRecords(c.data._record) : '');
		else
			return '<a target=_blank href="dl/'+encodeURIComponent(a)+'?_fai='+c.data.file_attachment_id+'"><b>'+a+'</b></a>'+ (c.data._record ?  renderParentRecords(c.data._record) : '');
		
	}
}


function getUsers4Chat(users){
	if(!users || users.length==0)return '';
	var	str='';
	for(var qi=0;qi<users.length;qi++)str+=', <a href=# onclick="return openChatWindow('+users[qi].userId+',\''+users[qi].userDsc+'\',true)"><b>'+users[qi].userDsc+'</b></a>';
	return str.substring(2);
}

function	safeIsEqual(a,b){
	if(a==null)return (b==null);
	else	return	a==b;
}

function syncMaptoStr(t, m, reload){
	if(!m || !t)return null;
	var str = getUsers4Chat([m]);
	var actionMap=['','var olan bir kayit düzenlendi','yeni bir kayit yapildi', 'var olan bir kayit silindi']
	if(m.gridId){
		var c=Ext.getCmp(t+'-'+m.gridId);
		if(!c)return null;
		if(!!reload && c.isVisible() && c.store)c.store.reload();
		if(c.name)str = '<b class="dirtyColor">'+c.name + '</b> mazgalında '+actionMap[m.crudAction]+' '+ str + ' tarafindan';
	} else {
		var c=Ext.getCmp(t+'-'+m.formCellId);
		if(!c)return null;
		str = '<b class="dirtyColor">'+c.fieldLabel + '</b> alaninda '+actionMap[m.crudAction]+' '+ str + ' tarafindan';
		if(!!reload){
			if(c.label)c.label.removeClass('dirtyColor');
			if(c.store)try{c.store.reload();
			} catch(e){
				promisRequest({url:'ajaxReloadFormCell?.t='+t+'&_fcid='+m.formCellId, requestWaitMsg:false, successCallback:function(json){
					c.store.removeAll();
					c.store.loadData(json.data);
				}});
			}
		} else {
			if(c.label)c.label.addClass('dirtyColor');
		}
	}
	if(m.timeDif)str+=', '+fmtTimeAgo(m.timeDif)+' önce.'
	return (!!reload || m.userId!=_scd.userId) ? str:null;
}

function showNotifications(t){
	promisRequest({url:'ajaxGetTabNotifications?.t='+t, requestWaitMsg:false, successCallback:function(json){
		if(json){
			var tab=Ext.getCmp(json.tabId);
			if(tab){
				if(tab._title){tab.setTitle(tab._title);tab._title=false;}
				if (json.msgs){
					for(var qi=0;qi<json.msgs.length;qi++){
						var msg=json.msgs[qi];
						msg.timeDif=json.time-msg.time;
						var msg=syncMaptoStr(json.tabId, msg, true);
						if(msg)Ext.infoMsg.msg(getLocMsg('js_warning'), msg, 10);
					}
				}
			}
		}		
	}});
	
	return false;
}

function postMsgGlobal(msg, userId, userDsc){
	promisRequest({
		url: 'ajaxPostChatMsg', requestWaitMsg: false,
		params: { receiver_user_id: userId, msg: msg },
		successResponse: function () {
			var c = Ext.getCmp('idChatGrid_'+userId);
			if(c)c.store.reload();
			else openChatWindow(userId, userDsc, true);
		}
	});
}

function	getUrlFromTab(tab){
	try{
		if(tab._l){
			if(!tab._l.pk)return null;
			var o=tab._l.pk.split('-');
			return "showForm?_tb_id="+o[0]+"&_tb_pk="+o[1]+"&_fid="+tab._formId;
		}else if(tab._lg && tab._tid){
			if(!tab._callCfg)return null;
			var s="showPage?_tid="+tab._tid;
			if(tab._callCfg.request)for(var q in tab._callCfg.request)if(q!='_tid' && q!='.w' && q!='.t' && q!='_ServerURL_'){
				s+='&'+q+'='+tab._callCfg.request[q];
			}
			return s;
		}
	} catch(e){}
	return	null;
}

function loadTabFromId(id){
	promisRequest({url:'ajaxQueryData?_qid=2224&id='+id, requestWaitMsg:false, successCallback:function(json){
		if(json && json.data && json.data.length){
			mainPanel.loadTab({attributes:{href:json.data[0].dsc}});
		}		
	}});
	return false;
} 
function fmtTypingBlock(j){
	if(!j || j.length==0)return "";
	var u = j[0].sender_user_id!=_scd.userId ? j[0].sender_user_id:j[0].receiver_user_id;
	return '<tr style="display:none;" id="idTypingWith_'+u+'"><td width=24 valign=top><img src="sf/pic'+u+'.png" width='+_app.profile_picture_width_mini+' height='+_app.profile_picture_height_mini
	+'></td><td width=5></td><td width=100% valign=top><img height=15 src="../images/custom/typing.gif"></td><td width=1></td><td width=5></td></tr>';
}

function getPPicImgTag(userId, mid){
	return '<img src="sf/pic'+userId+'.png" class="ppic-'+(!mid ? 'mini':'middle')+'">';
}


function loadMoreChat4(u){
	var g = Ext.getCmp('idChatGrid_'+u);
	if(g && g.store){
		if(!g.store.baseParams)g.store.baseParams={};
		if(!g.store.baseParams.limit)g.store.baseParams.limit=40;
		else g.store.baseParams.limit+=20;
		g.store.reload();
	}
	return false;
}

function fmtLoadMore(j){
	if(!j || j.length==0 || (j.length % 20>0))return "";
	var u = j[0].sender_user_id!=_scd.userId ? j[0].sender_user_id:j[0].receiver_user_id;
	return '<tr><td width=24 valign=top> </td><td width=5></td><td width=100% valign=top><a href=# onclick="return loadMoreChat4('+u+');"><b>&nbsp;'+getLocMsg('js_load_more')+'</b></a><br/><hr/></td><td width=1></td><td width=5></td></tr>';
}

function fmtChatList(j){
	if(_scd.userId!=j.sender_user_id){
		var str='<td width=24 valign=top>'+getPPicImgTag(j.sender_user_id)+'</td><td width=5></td><td width=100% valign=top>';
		if(j.msg.indexOf('!{')==0 && j.msg.charAt(j.msg.length-1)=='}')try{
			var x=j.msg.substring(2, j.msg.length-1);
			var i=x.indexOf('-');
			var u=x.substring(0,i),l=x.substring(i+1);
			str+='<span style="color:red;">Link</span> :<a href=# style="text-w" onclick="return loadTabFromId('+u+')"><b>'+l+'</b></a>';
		} catch(e){str+='<b style="color:red;">!error!</b>';}else str+='<span style="width:140px;word-wrap:break-word;display:block;">'+j.msg+'</span>';
		str+='<span class="cfeed"> · '+ fmtDateTimeWithDay2(j.sent_dttm)
			+'</span></td><td width=5></td><td width=1></td></tr><tr height=10><td colspan=5></td></tr>';
		return str;
	} else {
		var str='<td width=24> </td><td width=5></td><td width=100% valign=top align=right>';
		if(j.msg.indexOf('!{')==0 && j.msg.charAt(j.msg.length-1)=='}')try{
			var x=j.msg.substring(2, j.msg.length-1);
			var i=x.indexOf('-');
			var u=x.substring(0,i),l=x.substring(i+1);
			str+='<span style="color:red;">Link</span> :<a href=# style="text-w" onclick="return loadTabFromId('+u+')"><b>'+l+'</b></a>';
		} catch(e){str+='<b style="color:red;">!error!</b>';}else str+='<span style="width:140px;word-wrap:break-word;display:block;">'+j.msg+'</span>';
		str+='<span class="cfeed"> · '+ fmtDateTimeWithDay2(j.sent_dttm)
			+'</span></td><td width=5></td><td width=24 valign=top>'+getPPicImgTag(j.sender_user_id)+'</td></tr><tr height=10><td colspan=5></td></tr>';
		return str;
	}
}
function fmtOnlineUser(j){
	var str='<table border=0 width=100% padding=0 style="margin-left:-1px;"';
	if(j.instance_count>0)str+=" class='veliSelLightBlue'";
	str+='><tr><td width=24>'+getPPicImgTag(j.user_id,true)+'</td><td width="1"> </td><td width=99%> <b>&nbsp; ';
	if(j.adi_soyadi.length>20)j.adi_soyadi=j.adi_soyadi.substring(0,18)+'...';
	str+=j.adi_soyadi+'</b>';
	if(j.instance_count>0)str+='&nbsp; <b id="idChatNotRead_'+j.user_id+'" style="color:red;">('+(j.instance_count>9 ? '+9':j.instance_count)+')</b>';
	str+='<br>&nbsp; &nbsp; <span class="cfeed"> ';
	var s=j.user_role;
	if(s.length>3 && s.substring(0,2)=='!{' && s.substring(s.length-1,s.length)=='}' && s.indexOf('-')>-1){
		s='Link :'+s.substring(s.indexOf('-')+1,s.length-1)
	}
	if(s.length>27)s=s.substring(0,25)+'...';
	str+=s+'</span></td><td width=1%>';
	if(j.mobile)str+='<span class="status-item2 mobile-1">&nbsp;</span>';
	str+='<span class="status-item2 status-'+j.chat_status_tip+'" style="margin-right:1px;">&nbsp;</span></td></tr></table>';
	return str;
}

function reEscape(s) {
    return s.replace(/([.<>!*+?^$|:/,(){}\[\]])/mg, "");
}

function reloadHomeTab(){
alert('todo')
}

function showTutorial(t){
	if(recordInfoWindow && recordInfoWindow.isVisible()){
		recordInfoWindow.close();
	}
	return mainPanel.loadTab({attributes:{href:'showTutorial?_ttid='+t}});
}

function vcsHtml(x){ // 0: exclude, 1:edit, 2:insert, 3:delete, 9:synched
	if(x){
		x=x.split(',');
		if(1*x[0]!=9)
		return	'<img alt="'+x[1]+'" src="../images/custom/vcs'+x[0]+'.png" border=0>';
		else return x[1];
	}
}

function vcsFix(xgridId, tid, action){
	if(confirm('Would you like to FIX the problem?')){
		promisRequest({url:'ajaxVCSFix',requestWaitMsg:true,params:{t:tid, a:action}, successCallback:function(j){
			Ext.getCmp(xgridId).store.reload();
		}});
	}
	return false;
	
}


function vcsPush(xgrid, tid, tpk){
	var xparams={t:tid,k:tpk};
	var xgrd = xgrid;
	promisRequest({url:'ajaxVCSObjectPush',params:xparams, successCallback:function(j){
		if(j.error){
			switch(j.error){
				case	'force':
					if(confirm('There is conflicts. Do you STILL want to Overwrite?')){
						xparams.f=1;
						var xxgrd=xgrd;
						promisRequest({url:'ajaxVCSObjectPush',params:xparams, successCallback:function(j){
							Ext.infoMsg.msg('VCS','Record Pushed');
							xxgrd.ds.reload();
						}});
					}
					break;
					default:alert('unknown error: '+j.error )
			}
			return;
		}
		Ext.infoMsg.msg('VCS','Record Pushed');
		xgrd.ds.reload();
		} 
	}); 
}

function vcsPushMulti(xgrid, tid, tpk){
	var xparams={t:tid,k:tpk};
	var xgrd = xgrid;
	promisRequest({url:'ajaxVCSObjectPushMulti',params:xparams, successCallback:function(j){
		if(j.error){
			switch(j.error){
				case	'force':
					if(confirm('There is conflicts. Do you STILL want to Overwrite?')){
						xparams.f=1;
						var xxgrd=xgrd;
						promisRequest({url:'ajaxVCSObjectPushMulti',params:xparams, successCallback:function(j){
							Ext.infoMsg.msg('VCS','Records Pushed');
							xxgrd.ds.reload();
						}});
					}
					break;
					default:alert('unknown error: '+j.error )
			}
			return;
		}
		Ext.infoMsg.msg('VCS','Records Pushed');
		xgrd.ds.reload();
		} 
	}); 
}
function vcsPushAll(xgrid, keyz){
	var xparams={k:keyz};
	var xgrd = xgrid;
	promisRequest({url:'ajaxVCSObjectPushAll',params:xparams, successCallback:function(j){
		if(j.error){
			switch(j.error){
				case	'force':
					if(confirm('There is conflicts. Do you STILL want to Overwrite?')){
						xparams.f=1;
						var xxgrd=xgrd;
						promisRequest({url:'ajaxVCSObjectPushAll',params:xparams, successCallback:function(j){
							Ext.infoMsg.msg('VCS','Records Pushed');
							xxgrd.ds.reload();
						}});
					}
					break;
					default:alert('unknown error: '+j.error )
			}
			return;
		}
		Ext.infoMsg.msg('VCS','Records Pushed');
		xgrd.ds.reload();
		} 
	}); 
}
function vcsPull(xgrid, tid, tpk){
	var xparams={t:tid,k:tpk};
	var xgrd = xgrid;
	promisRequest({url:'ajaxVCSObjectPull',params:xparams, successCallback:function(j){
		if(j.error){
			switch(j.error){
				case	'force':
					if(confirm((j.error_msg || 'There is conflicts.') +' Do you STILL want to Overwrite?')){
						xparams.f=1;
						var xxgrd=xgrd;
						promisRequest({url:'ajaxVCSObjectPull',params:xparams, successCallback:function(j){
							Ext.infoMsg.msg('VCS','Record Pulled');
							xxgrd.ds.reload();
						}});					}
					break;
			}
			return;
		}
		Ext.infoMsg.msg('VCS','Record Pulled');
		xgrd.ds.reload();
	}
	
	}); 
}

function fncMnuVcs(xgrid){
	return [{text:'Push',iconCls:'icon-approval', _grid:xgrid, handler:function(aq){
			var sel=aq._grid._gp.getSelectionModel().getSelections();
			if(sel && sel.length>0){
				var d=sel[0].data.pkpkpk_vcsf;
				if(d){
					vcsPush(aq._grid, aq._grid.crudTableId, sel[0].id);
				} else Ext.Msg.alert(getLocMsg('js_error'),'Not VCS Object');
			} else Ext.Msg.alert(getLocMsg('js_error'),'Not selection');
		}},{text:'Pull',iconCls:'icon-approval', _grid:xgrid, handler:function(aq){
			var sel=aq._grid._gp.getSelectionModel().getSelections();
			if(sel && sel.length>0){
				var d=sel[0].data.pkpkpk_vcsf;
				if(d){
					vcsPull(aq._grid, aq._grid.crudTableId, sel[0].id);
				} else Ext.Msg.alert(getLocMsg('js_error'),'Not VCS Object');
			} else Ext.Msg.alert(getLocMsg('js_error'),'Not selection');
		}}
		,'-'
		/*,{text:'Synchronize Selected Record(Recursive)', _grid:xgrid, handler:function(aq){
			alert('TODO')
		}}*/
		,{text:'Synchronize Table Records', _grid:xgrid, handler:function(aq){
			mainPanel.loadTab({attributes:{modalWindow:true, _title_:aq._grid.name,href:'showPage?_tid=238&_gid1=2127', tid:aq._grid.crudTableId}})
//			promisRequest({url:'ajaxVCSObjectsList',params:{_tid:aq._grid.crudTableId}, successCallback:function(j){Ext.Msg.alert(getLocMsg('js_bilgi'),j.msgs.join('<br>'));}});			
		}}
		,'-',{text:'Add to VCS', _grid:xgrid, handler:function(aq){
			var sel=aq._grid._gp.getSelectionModel().getSelections();
			if(sel && sel.length>0 && !sel[0].data.pkpkpk_vcsf){
				promisRequest({url:'ajaxVCSObjectAction',params:{t:aq._grid.crudTableId, k:sel[0].id, a:2}, successCallback:function(j){
					Ext.infoMsg.msg('VCS','Added to VCS');
					aq._grid.ds.reload();
				}});
			}
		}},{text:'Ignore', _grid:xgrid, handler:function(aq){
			var sel=aq._grid._gp.getSelectionModel().getSelections();
			if(sel && sel.length>0 && sel[0].data.pkpkpk_vcsf && confirm('VCS ten cikarmak istediginizden gercekten emin misiniz? Çünkü daha sorna eklemek conflict lere sebep olacaktır')){
				promisRequest({url:'ajaxVCSObjectAction',params:{t:aq._grid.crudTableId, k:sel[0].id, a:3}, successCallback:function(j){
					Ext.infoMsg.msg('VCS','Deleted from VCS');
					aq._grid.ds.reload();
				}});
			}
		}},'-',{text:'Move to Another Project', _grid:xgrid, handler:function(aq){
			var sel=aq._grid._gp.getSelectionModel().getSelected();
			if(sel && sel.data.pkpkpk_vcsf){
				var cmbSt2=[];
				if(lookup_w5_project.data)for(var qi=0;qi<lookup_w5_project.data.length;qi++)if(_scd.projectId!=lookup_w5_project.data[qi].id)cmbSt2.push([lookup_w5_project.data[qi].id, lookup_w5_project.data[qi].dsc]);
				var cmbProject2 = new Ext.form.ComboBox({width:205, typeAhead: false, mode: 'local',triggerAction: 'all',selectOnFocus:true,forceSelection:true, store:cmbSt2, emptyText:'Choose new Project'});
				var wx=new Ext.Window({
					modal:true, shadow:false, border:false,
					width:220,
					autoHeight:true,
					closeAction:'destroy',
					title:'Move To Another Project',

					items: [cmbProject2],

					buttons: [{
					    text: 'Move',
					    handler: function(){
						if(cmbProject2.getValue() && confirm('Would you like to move to another Project?'))promisRequest({url:'ajaxVCSMove2AnotherProject',requestWaitMsg:true,params:{t:aq._grid.crudTableId, k:sel.id, np:cmbProject2.getValue()}, successCallback:function(j){
							wx.hide();
							aq._grid.ds.reload();
						}});
					    }
					}]
				});
				wx.show();
			}
		}}];
}


if(typeof(iwb) == 'undefined')iwb = {};
if(!iwb.ui)iwb.ui={};

/* Log Utils*/
if(!iwb.log)iwb.log={};
if(!iwb.log.map)iwb.log.map={};
iwb.log.log=function(group,msg){
	if(!group || !msg)return;
	try{
		var m=iwb.log.map[group];
		if(!m){
			m={}
			iwb.log.map[group]=m;
		}
		var m2 = m[msg];
		if(!m2){
			m[msg]={no:1, idttm: new Date()};
		} else {
			m2.no++;
			m2.vddtm=new Date();
		}		
	}catch(e){
		if(iwb.debug)console.log('error:iwb.log.log->['+group+','+msg+']');
	}
}
iwb.log.persistLog=function(){
}


function buildPanel(obj, isMasterFlag){
	if(!obj)return false;
	if(obj.grid){
		if(obj.detailGrids)
			return addTab4GridWSearchFormWithDetailGrids(obj, isMasterFlag);
		else
			return addTab4GridWSearchForm(obj);
	} else if(obj.detailGrids)
		return addTab4DetailGridsWSearchForm(obj);
	else 
		return false;	
}
iwb.ui.buildPanel=buildPanel;

iwb.ui.buildCRUDForm=function(getForm, callAttributes, _page_tab_id){
	var extDef = getForm.render(); 

	var extraItems = (!getForm.renderTip || getForm.renderTip!=3) ? extDef.items : extDef.items[0].items
	if (_app.alarm_view_tip && 1 * _app.alarm_view_tip == 1 && getForm.alarmTemplates && getForm.alarmTemplates.length > 0) {
		var itx = [],
			gals = getForm.alarmTemplates;
		for (var qs = 0; qs < gals.length; qs++) {
			itx.push(new Ext.form.Checkbox({
				labelSeparator: '',
				_controlTip: 5,
				value: 1,
				checked: gals[qs].checked,
				fieldLabel: '',
				boxLabel: gals[qs].text,
	            "id": '_alarm' + getForm.id + gals[qs].xid,
	            "disabled": !!gals[qs].disabled
	        }));
	        itx.push(new Ext.ux.form.DateTime({
	            "width": 200,
	            "id": "_alarm_dttm" + getForm.id + gals[qs].xid,
	            "disabled": !!gals[qs].disabled2,
	            "value": gals[qs].value || ''
	        }));
	    }
	    
	    extraItems.splice(1, 0, {
	        xtype: 'fieldset',
	        title: '${Alarms}',
	        id: 'alm_' + getForm.id,
	        labelWidth: 100,
	        items: itx
	    })
	}

	if (_app.form_sms_mail_view_tip && 1 * _app.form_sms_mail_view_tip == 1 && getForm.smsMailTemplates && getForm.smsMailTemplates.length > 0) {
	    var itx = [],
	        gals = getForm.smsMailTemplates;
	    for (var qs = 0; qs < gals.length; qs++) {
	        itx.push(new Ext.form.Checkbox({
	            labelSeparator: '',
	            _controlTip: 5,
	            value: 1,
	            checked: gals[qs].checked,
	            fieldLabel: '',
	            boxLabel: gals[qs].text,
	            "id": '_frm_smsmail' + getForm.id + gals[qs].xid,
	            "disabled": !!gals[qs].disabled
	        }));
	    }
	    extraItems.splice(1, 0, {
	        xtype: 'fieldset',
	        title: '${eposta_sms}',
	        id: 'smt_' + getForm.id,
	        labelWidth: 100,
	        items: itx
	    })
	}
	if (_app.conversion_view_tip && 1 * _app.conversion_view_tip == 1 && getForm.conversionForms && getForm.conversionForms.length > 0) {
	    var itx = [],
	        gals = getForm.conversionForms;
	    for (var qs = 0, cnvc=1; qs < gals.length; qs++) {
	        itx.push(gals[qs].text ? new Ext.form.Checkbox({
	            labelSeparator: '', _controlTip: 5, value: 1,
	            checked: gals[qs].checked, fieldLabel: '',
	            boxLabel: gals[qs].text,
	            id: '_cnvrsn' + getForm.id + gals[qs].xid,
	            disabled: !!gals[qs].disabled
	        }) : new Ext.form.Label({
	            labelSeparator: '', _controlTip: 102, 
	            fieldLabel: gals[qs].lbl+'... #'+(cnvc++),
	            html: (gals[qs].sync ? '<i style="color:red">auto_update</i>':'')+renderParentRecords(gals[qs]._record)
	        }));
	    }
	    extraItems.splice(1, 0, {
	        xtype: 'fieldset',
	        title: '${convertion}',
	        id: 'cnv_' + getForm.id,
	        labelWidth: 100,
	        items: itx
	    })
	}

	function form_extra_processes() {
	    //form-sms-mail post process
	    var smtBtn = Ext.getCmp('smt_' + getForm.id);
	    if (smtBtn) {
	        switch (1 * _app.form_sms_mail_view_tip) {
	            case 2:
	                if (smtBtn && smtBtn.menu && smtBtn.menu.items.items) {
	                    var smsItems = smtBtn.menu.items.items;
	                    var smsStr = '';
	                    for (var qm = 0; qm < smsItems.length; qm++)
	                        if (smsItems[qm].checked) smsStr += ',' + smsItems[qm].xid;
	                    if (smsStr) getForm._cfg.extraParams._smsStr = smsStr.substr(1);
	                }
	                break;
	            case 1:
	                var gals3 = getForm.smsMailTemplates,
	                    smsStr2 = '';;
	                for (var qs = 0; qs < gals3.length; qs++) {
	                    var cb1 = Ext.getCmp('_frm_smsmail' + getForm.id + gals3[qs].xid);
	                    if (cb1 && cb1.checked) {
	                        smsStr2 += ',' + gals3[qs].xid;
	                    }
	                }
	                //                                        alert(smsStr2);return false;
	                if (smsStr2) getForm._cfg.extraParams._smsStr = smsStr2.substr(1);
	                break;
	        }
	    }
	    //form-conversion post process                
	    var cnvBtn = Ext.getCmp('cnv_' + getForm.id);
	    if (cnvBtn) {
	        switch (1 * _app.conversion_view_tip) {
	            case 2:
	                if (cnvBtn.menu && cnvBtn.menu.items.items) {
	                    var cnvItems = cnvBtn.menu.items.items;
	                    var cnvStr = '';
	                    for (var qm = 0; qm < cnvItems.length; qm++)
	                        if (cnvItems[qm].checked) cnvStr += ',' + cnvItems[qm].xid;
	                    if (cnvStr) getForm._cfg.extraParams._cnvStr = cnvStr.substr(1);
	                }
	                break;
	            case 1:
	                var gals2 = getForm.conversionForms,
	                    cnvStr2 = '';;
	                for (var qs = 0; qs < gals2.length; qs++) {
	                    var cb1 = Ext.getCmp('_cnvrsn' + getForm.id + gals2[qs].xid);
	                    if (cb1 && cb1.checked) {
	                        cnvStr2 += ',' + gals2[qs].xid;
	                    }
	                }
	                if (cnvStr2) getForm._cfg.extraParams._cnvStr = cnvStr2.substr(1);
	                break;
	        }
	    }
	    //for alarm                
	    var almBtn = Ext.getCmp('alm_' + getForm.id);
	    if (almBtn) {
	        switch (1 * _app.alarm_view_tip) {
	            case 2:
	                if (almBtn.menu && almBtn.menu.items.items) {
	                    var almItems = almBtn.menu.items.items;
	                    var almStr = '';
	                    for (var qm = 0; qm < almItems.length; qm++)
	                        if (almItems[qm].checked) {
	                            almStr += ',' + almItems[qm].xid;
	                            var vx = almItems[qm].menu && almItems[qm].menu.items && almItems[qm].menu.items.items && almItems[qm].menu.items.items.length > 0 && almItems[qm].menu.items.items[0].value ? almItems[qm].menu.items.items[0].value : null;
	                            if (vx) almStr += '-' + vx;
	                        }
	                    if (almStr) getForm._cfg.extraParams._almStr = almStr.substr(1);
	                }
	                break;
	            case 1:
	                var gals = getForm.alarmTemplates,
	                    almStr2 = '';;
	                for (var qs = 0; qs < gals.length; qs++) {
	                    var cb1 = Ext.getCmp('_alarm' + getForm.id + gals[qs].xid);
	                    if (cb1 && cb1.checked) {
	                        almStr2 += ',' + gals[qs].xid;
	                        var dt1 = Ext.getCmp('_alarm_dttm' + getForm.id + gals[qs].xid);
	                        if (dt1 && dt1.dateValue) almStr2 += '-' + fmtDateTime(dt1.dateValue);
	                        else {
	                            Ext.infoMsg.msg('UYARI', 'Alarm tarihi alanina deger girilmeli');
	                            return false;
	                        }
	                    }
	                }
	                if (almStr2) getForm._cfg.extraParams._almStr = almStr2.substr(1);
	        }
	    }
	}

	var realAction = 1 * extDef.baseParams.a
	var btn = []
	if (!getForm.viewMode) {
	    var sv_btn_visible = (extDef.baseParams.sv_btn_visible || 1);
	    if (sv_btn_visible * 1 == 1) {
	        var saveBtn = {
	            text: 1 * getForm.a == 1 ? '${update}' : (realAction == 5 ? '${copy}' : '${save}'),
	            id: 'sb_' + getForm.id,
	            iconAlign: 'top',
	            scale: 'medium',
	            style: {
	                margin: '0px 5px 0px 5px'
	            },
	            iconCls: 'ikaydet',
	            handler: function(a, b, c) {
	                if (realAction == 5 && getForm.copyTableIds && getForm.copyTableIds.length > 0) {
	                    var mzmz, qwin = new Ext.Window({
	                        layout: 'fit',
	                        width: 300,
	                        height: 200,
	                        closeAction: 'destroy',
	                        plain: true,
	                        modal: true,
	                        title: '${copy_which_sub_info}',
	                        items: {
	                            xtype: 'form',
	                            border: false,
	                            labelWidth: 10,
	                            items: {
	                                xtype: 'checkboxgroup',
	                                itemCls: 'x-check-group-alt',
	                                columns: 1,
	                                items: getForm.copyTableIds
	                            }
	                        },
	                        buttons: [{
	                            text: '${ok}',
	                            handler: function(ax, bx, cx) {
	                                var tblIds = '';
	                                for (var qi = 0; qi < getForm.copyTableIds.length; qi++) {
	                                    if (Ext.get(getForm.copyTableIds[qi].id).dom.checked) {
	                                        tblIds += ',' + getForm.copyTableIds[qi].id.substr(7);
	                                    }
	                                }
	                                var r = null;
	                                var bm=false;
	                                if(extDef._extendedForms)for(var qi=0;qi<extDef._extendedForms.length;qi++)if(extDef._extendedForms[qi].componentWillPost){
	                                    bm=true;
	                                }
	                                if (extDef.componentWillPost || bm) {
	                                    if (getForm._cfg.formPanel.getForm().isValid()) {
	                                        var vals=getForm._cfg.formPanel.getForm().getValues();
	                                        if(extDef.componentWillPost){
	                                            r = extDef.componentWillPost(vals);
	                                            if (!r) return;
	                                        }
	                                        if(extDef._extendedForms)for(var qi=0;qi<extDef._extendedForms.length;qi++)if(extDef._extendedForms[qi].componentWillPost){
	                                            var r2=extDef._extendedForms[qi].componentWillPost(vals);
	                                            if(!r2)return;
	                                            if(!r)r=r2;
	                                            else if(typeof r == 'object' && typeof r2 == 'object'){
	                                                r=Ext.apply(r,r2);
	                                            }
	                                        }
	                                    } else {
	                                        getForm._cfg.formPanel.getForm().findInvalid();
	                                        return;
	                                    }
	                                }
	                                if (!getForm._cfg.formPanel.getForm().isValid()) {
	                                    getForm._cfg.formPanel.getForm().findInvalid();
	                                    return null;
	                                }
	                                getForm._cfg.dontClose = 0;
	                                if (typeof r == 'object') getForm._cfg.extraParams = r;
	                                if (tblIds) {
	                                    if (getForm._cfg.extraParams) getForm._cfg.extraParams.tblIds = _copy_tbl_ids.substr(1);
	                                    else getForm._cfg.extraParams = {
	                                        _copy_tbl_ids: tblIds.substr(1)
	                                    }
	                                }
	                                qwin.destroy();
	                                formSubmit(getForm._cfg)
	                            }
	                        }, {
	                            text: '${cancel}',
	                            handler: function() {
	                                qwin.destroy();
	                            }
	                        }]
	                    });
	                    qwin.show();
	                    return;
	                }

	                var r = null;
	                //manuel validation
	                var bm=false;
	                if(extDef._extendedForms)for(var qi=0;qi<extDef._extendedForms.length;qi++)if(extDef._extendedForms[qi].componentWillPost){
	                    bm=true;
	                }

	                if (extDef.componentWillPost || bm) {
	                    if (getForm._cfg.formPanel.getForm().isValid()) {
	                        var vals=getForm._cfg.formPanel.getForm().getValues();
	                        if(extDef.componentWillPost){
	                            r = extDef.componentWillPost(vals);
	                            if (!r) return;
	                        }
	                        if(extDef._extendedForms)for(var qi=0;qi<extDef._extendedForms.length;qi++)if(extDef._extendedForms[qi].componentWillPost){
	                            var r2=extDef._extendedForms[qi].componentWillPost(vals);
	                            if(!r2)return;
	                            if(!r)r=r2;
	                            else if(typeof r == 'object' && typeof r2 == 'object'){
	                                r=Ext.apply(r,r2);
	                            }
	                        }
	                    } else {
	                        getForm._cfg.formPanel.getForm().findInvalid();
	                        return;
	                    }
	                }
	                if (!getForm._cfg.formPanel.getForm().isValid()) {
	                    getForm._cfg.formPanel.getForm().findInvalid();
	                    return null;
	                }
	                getForm._cfg.dontClose = 0;
	                getForm._cfg.extraParams = {};
	                if ((typeof r == 'object') && (r != null)) getForm._cfg.extraParams = r;
	                //bmp TODO
	                if (getForm.bpmProcesses && getForm.bpmProcesses.length > 0) { //TODO
	                    if (confirm('BPM için\n * ' + getForm.bpmProcesses[0].dsc + '\n\nkullanarak devam etmek ister misiniz?')) {
	                        if (!getForm._cfg.extraParams) getForm._cfg.extraParams = {};
	                        getForm._cfg.extraParams._sbpid = getForm.bpmProcesses[0].id;
	                    }
	                }

	                form_extra_processes();

	                formSubmit(getForm._cfg);
	            }
	        };

	        btn.push(saveBtn);
	        //form-sms-mail menu if(_app.form_sms_mail_view_tip && 1*_app.form_sms_mail_view_tip==1
	        if (_app.form_sms_mail_view_tip && 1 * _app.form_sms_mail_view_tip == 2 && getForm.smsMailTemplates && getForm.smsMailTemplates.length > 0) {
	            btn.push({
	                text: '${eposta_sms}',
	                iconAlign: 'top',
	                scale: 'medium',
	                id: 'smt_' + getForm.id,
	                style: {
	                    margin: '0px 5px 0px 5px'
	                },
	                iconCls: 'isms_mail',
	                menu: getForm.smsMailTemplates
	            });
	            btn.push('-');
	        }
	        //form-conversion menu        
	        if (_app.conversion_view_tip && 1 * _app.conversion_view_tip == 2 && getForm.conversionForms && getForm.conversionForms.length > 0) {
	            btn.push({
	                text: '${convertion}',
	                iconAlign: 'top',
	                scale: 'medium',
	                id: 'cnv_' + getForm.id,
	                style: {
	                    margin: '0px 5px 0px 5px'
	                },
	                iconCls: 'iconvert_form',
	                menu: getForm.conversionForms
	            });
	            btn.push('-');
	        }
	        //form-alarm menu        
	        if (_app.alarm_view_tip && 1 * _app.alarm_view_tip == 2 && getForm.alarmTemplates && getForm.alarmTemplates.length > 0) {
	            var gals = getForm.alarmTemplates;
	            for (var aq = 0; aq < gals.length; aq++) {
	                if (gals[aq].disabled2) {
	                    gals[aq].text += " ... [" + gals[aq].value + "]";
	                } else {
	                    var dtj = gals[aq].relatedFieldName ? {
	                        width: 200,
	                        relatedFieldName: gals[aq].relatedFieldName,
	                        timeTip: gals[aq].timeTip,
	                        timeDif: gals[aq].timeDif
	                    } : {
	                        width: 200
	                    }
	                    if (gals[aq].value) dtj.value = gals[aq].value;
	                    var dttm = new Ext.ux.form.DateTime(dtj);
	                    if (!gals[aq].value) dttm.on("render", function(ax, bx, cx) {
	                        if (!this.value) {
	                            var cd = new Date();
	                            var relDt = extDef["_" + this.relatedFieldName];
	                            if (relDt) {
	                                if (relDt.value) {
	                                    cd = relDt.getValue();
	                                    if (!relDt._alarms) relDt._alarms = [];
	                                    relDt._alarms.push(this);
	                                    relDt.on('change', function(aq, bq, cq) {
	                                        var al = this._alarms;
	                                        if (al)
	                                            for (var qs = 0; qs < al.length; qs++) {
	                                                al[qs].setValue(timeDifDt(this.getValue(), al[qs].timeTip, al[qs].timeDif));
	                                            }
	                                    });
	                                } else {
	                                    Ext.infoMsg.msg('UYARI', 'Once [' + this.relatedFieldName + '] alanina deger girilmeli');
	                                    return;
	                                }
	                            }
	                            this.setValue(timeDifDt(cd, this.timeTip, this.timeDif));
	                        }
	                    })
	                    gals[aq].menu = [dttm]
	                }
	            }
	            btn.push({
	                text: '${alarm}',
	                iconAlign: 'top',
	                scale: 'medium',
	                id: 'alm_' + getForm.id,
	                style: {
	                    margin: '0px 5px 0px 5px'
	                },
	                iconCls: 'ibig_alarm',
	                menu: getForm.alarmTemplates
	            });
	            btn.push('-');
	        }
	    }
	    //post & continue    
	    if (getForm.contFlag && 1 * getForm.contFlag == 1 && realAction == 2) {
	        btn.push({
	            text: '${copy_continue}',
	            id: 'cc_' + getForm.id,
	            iconAlign: 'top',
	            scale: 'medium',
	            style: {
	                margin: '0px 5px 0px 5px'
	            },
	            iconCls: 'inext',
	            handler: function(a, b, c) {
	                if (!getForm._cfg.formPanel.getForm().isDirty() && !confirm('${attention_you_save_without_change_are_you_sure}')) return;
	                var r = null;
	                if (extDef.componentWillPost) {
	                    if (getForm._cfg.formPanel.getForm().isValid()) {
	                        r = extDef.componentWillPost(getForm._cfg.formPanel.getForm().getValues());
	                        if (!r) return
	                    } else {
	                        getForm._cfg.formPanel.getForm().findInvalid();
	                        return;
	                    }
	                }
	                if (!getForm._cfg.formPanel.getForm().isValid()) {
	                    getForm._cfg.formPanel.getForm().findInvalid();
	                    return null;
	                }
	                if(!getForm._cfg.callback)getForm._cfg.callback = function(js, conf) {
	                    if (js.success) Ext.Msg.alert('${info}', '${operation_completed}');
	                }
	                getForm._cfg.dontClose = 1;
	                getForm._cfg.extraParams = {};
	                if ((typeof r == 'object') && (r != null)) getForm._cfg.extraParams = r;
	                form_extra_processes();
	                formSubmit(getForm._cfg);
	            }
	        });

	        btn.push({
	            text: '${copy_new}',
	            id: 'cn_' + getForm.id,
	            iconAlign: 'top',
	            scale: 'medium',
	            style: {
	                margin: '0px 5px 0px 5px'
	            },
	            iconCls: 'ikaydet_yeni',
	            handler: function(a, b, c) {
	                var r = null;
	                if (extDef.componentWillPost) {
	                    if (getForm._cfg.formPanel.getForm().isValid()) {
	                        r = extDef.componentWillPost(getForm._cfg.formPanel.getForm().getValues());
	                        if (!r) return
	                    } else {
	                        getForm._cfg.formPanel.getForm().findInvalid();
	                        return;
	                    }
	                }
	                if (!getForm._cfg.formPanel.getForm().isValid()) {
	                    getForm._cfg.formPanel.getForm().findInvalid();
	                    return null;
	                }
	                if(!getForm._cfg.callback)getForm._cfg.callback = function(js, conf) {
	                    if (js.success) Ext.Msg.alert('${info}', '${operation_completed}');
	                }
	                getForm._cfg.dontClose = 1;
	                getForm._cfg.resetValues = 1;
	                if (typeof r == 'object') getForm._cfg.extraParams = r;
	                formSubmit(getForm._cfg);
	            }
	        });
	    }
	}
	//close
	btn.push({
	    text: '${close}',
	    id: 'cl_' + getForm.id,
	    iconAlign: 'top',
	    scale: 'medium',
	    style: {
	        margin: '0px 5px 0px 5px'
	    },
	    iconCls: 'ikapat',
	    handler: function(a, b, c) {
	        if (!getForm.viewMode && 1 * _app.form_cancel_dirty_control && getForm._cfg.formPanel.getForm().isDirty() && !confirm('${changed_records_sure_to_close}')) return;
	        if (!callAttributes.modalWindowFlag) mainPanel.getActiveTab().destroy();
	        else mainPanel.closeModalWindow()
	    }
	});

	if (getForm.fileAttachFlag) {
		btn.push('-');
		btn.push({
			text: '${files}' + (getForm.fileAttachCount > 0 ? ' (' + getForm.fileAttachCount + ')' : ''),
			id: 'af_' + getForm.id,
			iconAlign: 'top',
			scale: 'medium',
			style: {
				margin: '0px 5px 0px 5px'
			},
			iconCls: 'imail_attach',
			menu: [{
				text: getLocMsg('js_dosya_sisteminden_ekle'),
				_f: getForm,
				handler: function(a) {
					var getForm = a._f;
					var table_pk = '';
					if (getForm.a == 1) {
						for (var key in getForm.pk)
							if (key != 'customizationId') table_pk += "|" + getForm.pk[key];
					} else table_pk = "|" + getForm.tmpId;
					fnNewFileAttachment4Form(a._f.crudTableId, table_pk.substring(1))
				}
			}, /*{
				text: getLocMsg('js_daha_once_eklenmis_dosyalardan_ekle'),
				_f: getForm,
				handler: function(a, b) {
					var getForm = a._f;
					var table_pk = '';
					if (getForm.a == 1) {
						for (var key in getForm.pk)
							if (key != 'customizationId') table_pk += "|" + getForm.pk[key];
					} else table_pk = "|" + getForm.tmpId;
					mainPanel.loadTab({
						attributes: {
							_title_: 1,
							modalWindow: true,
							href: 'showPage?_tid=259&_gid1=672',
							tableId: a._f.crudTableId,
							tablePk: table_pk.substring(1)
						}
					})
				}
			}, '-',*/ {
				text: '${related_files}',
				_f: getForm,
				handler: function(a, b, c) {
					var getForm = a._f;
					var table_pk = '';
					if (getForm.a == 1) {
						for (var key in getForm.pk)
							if (key != 'customizationId') table_pk += "|" + getForm.pk[key];
					} else table_pk = "|" + getForm.tmpId;
					var cfg = {
						attributes: {
							modalWindow: true,
							href: 'showPage?_tid=518&_gid1=458',
							_pk: {
								tfile_attachment_id: 'file_attachment_id'
							},
							baseParams: {
								xtable_id: getForm.crudTableId,
								xtable_pk: table_pk.substring(1)
							}
						}
					};
					cfg.attributes._title_ = getForm.name
					mainPanel.loadTab(cfg);
				}
			}]
		});
	}

	if (1 * getForm.a == 2 && getForm.manualStartDemand) {
	    btn.push({
	        text: '${kaydet_onay_baslatma_talebi}',
	        id: 'sapp_' + getForm.id,
	        iconAlign: 'top',
	        scale: 'medium',
	        style: {
	            margin: '0px 5px 0px 5px'
	        },
	        iconCls: 'app_req',
	        handler: function(a, b, c) {
	            var r = null;
	            if (extDef.componentWillPost) {
	                if (getForm._cfg.formPanel.getForm().isValid()) {
	                    r = extDef.componentWillPost(getForm._cfg.formPanel.getForm().getValues());
	                    if (!r) return
	                } else {
	                    getForm._cfg.formPanel.getForm().findInvalid();
	                    return;
	                }
	            };
	            if (!getForm._cfg.formPanel.getForm().isValid()) {
	                getForm._cfg.formPanel.getForm().findInvalid();
	                return null;
	            }
	            getForm._cfg.extraParams = {};
	            if (typeof r == 'object') getForm._cfg.extraParams = r;
	            submitAndApproveTableRecord(-1, getForm, ((getForm.approval && getForm.approval.dynamic) ? getForm.approval.dynamic : null));
	        }
	    });
	}
	if (1 * getForm.a == 1 && getForm.manualStartDemand) {
	    btn.push({
	        text: '${guncelle_onay_baslatma_talebi}',
	        id: 'uapp_' + getForm.id,
	        iconAlign: 'top',
	        scale: 'medium',
	        style: {
	            margin: '0px 5px 0px 5px'
	        },
	        iconCls: 'app_req',
	        handler: function(a, b, c) {
	            var r = null;
	            if (extDef.componentWillPost) {
	                if (getForm._cfg.formPanel.getForm().isValid()) {
	                    r = extDef.componentWillPost(getForm._cfg.formPanel.getForm().getValues());
	                    if (!r) return
	                } else {
	                    getForm._cfg.formPanel.getForm().findInvalid();
	                    return;
	                }
	            };
	            if (!getForm._cfg.formPanel.getForm().isValid()) {
	                getForm._cfg.formPanel.getForm().findInvalid();
	                return null;
	            }
	            getForm._cfg.extraParams = {};
	            if (typeof r == 'object') getForm._cfg.extraParams = r;
	            submitAndApproveTableRecord(-1, getForm, ((getForm.approval && getForm.approval.dynamic) ? getForm.approval.dynamic : null));
	        }
	    });
	}

	//approval
	if (1 * getForm.a == 1 && getForm.approval) {
	    btn.push('-');
	    //    btn.push({text: '${onay_adimi}<br>'+getForm.approval.stepDsc});
	    if (getForm.approval.wait4start) {
	        btn.push({
	            text: '${onay_iste}',
	            id: 'dapp_' + getForm.id,
	            iconAlign: 'top',
	            scale: 'medium',
	            style: {
	                margin: '0px 5px 0px 5px'
	            },
	            iconCls: 'app_req',
	            handler: function(a, b, c) {
	                submitAndApproveTableRecord(901, getForm, getForm.approval.dynamic)
	            }
	        });
	    } else {
	        btn.push({
	            text: getForm.approval.eSignFlag ? 'E-Imza Onayla' : '${approve}',
	            id: 'aapp_' + getForm.id,
	            tooltip: getForm.approval.stepDsc,
	            iconAlign: 'top',
	            scale: 'medium',
	            style: {
	                margin: '0px 5px 0px 5px'
	            },
	            iconCls: 'iapprove',
	            handler: function(a, b, c) {
	                if (!getForm.viewMode) {
	                    var r = null
	                    if (extDef.componentWillPost) {
	                        if (getForm._cfg.formPanel.getForm().isValid()) {
	                            r = extDef.componentWillPost(getForm._cfg.formPanel.getForm().getValues());
	                            if (!r) return
	                        } else {
	                            getForm._cfg.formPanel.getForm().findInvalid();
	                            return;
	                        }
	                    }
	                    if (!getForm._cfg.formPanel.getForm().isValid()) {
	                        getForm._cfg.formPanel.getForm().findInvalid();
	                        return null;
	                    }
	                    getForm._cfg.dontClose = 0;
	                    if (typeof r == 'object') {
	                        getForm._cfg.extraParams = r;
	                    }
	                }
	                if (getForm.approval.eSignFlag) {
	                    openPopup('showPage?_tid=691&_arid=' + getForm.approval.approvalRecordId, '_blank', 800, 600, 1);
	                    mainPanel.closeModalWindow();
	                    return;
	                } else submitAndApproveTableRecord(1, getForm);
	            }
	        });
	        if (getForm.approval.returnFlag) {
	            btn.push({
	                text: '${give_back}',
	                id: 'gbapp_' + getForm.id,
	                iconAlign: 'top',
	                scale: 'medium',
	                style: {
	                    margin: '0px 5px 0px 5px'
	                },
	                iconCls: 'ireturn',
	                handler: function(a, b, c) {
	                    submitAndApproveTableRecord(2, getForm)
	                }
	            });
	        }
	        btn.push({
	            text: '${reject}',
	            id: 'rapp_' + getForm.id,
	            iconAlign: 'top',
	            scale: 'medium',
	            style: {
	                margin: '0px 5px 0px 5px'
	            },
	            iconCls: 'ireject',
	            handler: function(a, b, c) {
	                submitAndApproveTableRecord(3, getForm)
	            }
	        });
	        btn.push({
	            text: '${approve_log}',
	            id: 'lapp_' + getForm.id,
	            iconAlign: 'top',
	            scale: 'medium',
	            style: {
	                margin: '0px 5px 0px 5px'
	            },
	            iconCls: 'ilog',
	            handler: function(a, b, c) {
	                mainPanel.loadTab({
	                    attributes: {
	                        modalWindow: true,
	                        href: 'showPage?_tid=259&_gid1=530',
	                        baseParams: {
	                            xapproval_record_id: getForm.approval.approvalRecordId
	                        }
	                    }
	                });
	            }
	        });
	    }
	}

	//manual form-conversion menu        
	if (1 * getForm.a == 1) {
	    var pk = null,
	        toolButtons = [];
	    for (var xi in getForm.pk)
	        if (xi != 'customizationId') {
	            pk = getForm.pk[xi];
	            break;
	        }
	    btn.push('-', ' ', ' ', ' ');
	    if ((getForm.manualConversionForms && getForm.manualConversionForms.length > 0) || (getForm.reportList && getForm.reportList.length > 0)) {
	        toolButtons.push({
	            text: 'Kayit Bilgisi',
	            /*iconCls:'icon-info',*/
	            handler: function() {
	                fnTblRecEdit(getForm.crudTableId, pk, false);
	            }
	        });
	        toolButtons.push('-');
	        if (getForm.manualConversionForms && getForm.manualConversionForms.length > 0) {
	            for (var xi = 0; xi < getForm.manualConversionForms.length; xi++) getForm.manualConversionForms[xi].handler = function(aq, bq, cq) {
	                mainPanel.loadTab({
	                    attributes: {
	                        href: 'showForm?a=2&_fid=' + aq._fid + '&_cnvId=' + aq.xid + '&_cnvTblPk=' + pk
	                    }
	                });
	            }
	            toolButtons.push({
	                text: 'Dönüstür',
	                iconCls: 'icon-operation',
	                menu: getForm.manualConversionForms
	            });
	        }

	        if (getForm.reportList && getForm.reportList.length > 0) {
	            for (var qz = 0; qz < getForm.reportList.length; qz++) {
	                getForm.reportList[qz].handler = function(aq, bq, cq) {
	                    //mainPanel.loadTab({attributes:{href:'showForm?a=2&_fid='+aq._fid+'&_cnvId='+aq.xid+'&_cnvTblPk='+sel.id}});
	                    alert('olacak')
	                }
	            }
	            toolButtons.push({
	                text: 'Raporlar',
	                iconCls: 'icon-ireport',
	                menu: getForm.reportList
	            });
	        }		
			
	        btn.push({
	            text: 'Diger...',
	            iconAlign: 'top',
	            scale: 'medium',
	            style: {
	                margin: '0px 5px 0px 5px'
	            },
	            iconCls: 'ibig_info',
	            menu: toolButtons
	        });
	    } else {
			// Kayıt Bilgisi Yorum Yapıldı
	       /* btn.push({
	            text: 'Kayit Bilgisi',
	            iconAlign: 'top',
	            scale: 'medium',
	            style: {
	                margin: '0px 5px 0px 5px'
	            },
	            iconCls: 'ibig_info',
	            handler: function() {
	                fnTblRecEdit(getForm.crudTableId, pk, false);
	            }
	        });*/
	    }
	}

	if (getForm.extraButtons && getForm.extraButtons.length > 0) {
	    btn.push('-');
	    btn.push(getForm.extraButtons)
	}

	btn.push('->')

	btn.push({
	    text: '${help}',
	    id: 'fhelp_' + getForm.id,
	    iconAlign: 'top',
	    scale: 'medium',
	    style: {
	        margin: '0px 5px 0px 5px'
	    },
	    iconCls: 'ihelp',
	    handler: function(a, b, c) {
	        mainPanel.loadTab({
	            attributes: {
	                _title_: getForm.name,
	                modalWindow: true,
	                href: 'showPage?_tid=977&xtable_id=40&xtable_pk=' + getForm.formId
	            }
	        });
	    }
	});

	if (getForm.a == 1 || getForm.tmpId) {
	    var xb = false;
	    if (getForm.watchFlag) {
	        btn.push({
	            text: !getForm.watchId ? '${watch}' : '${dont_watch}',
	            id: 'wd_' + getForm.id,
	            iconAlign: 'top',
	            scale: 'medium',
	            style: {
	                margin: '0px 5px 0px 5px'
	            },
	            iconCls: !getForm.watchId ? 'ibig_watch' : 'ibig_dontwatch',
	            handler: function(a, b, c) {
	                var table_pk = '';
	                if (getForm.a == 1) {
	                    for (var key in getForm.pk) {
	                        if (key != 'customizationId') {
	                            table_pk = getForm.pk[key];
	                        }
	                    }
	                } else table_pk = "|" + getForm.tmpId;
	                mainPanel.loadTab({
	                    attributes: {
	                        modalWindow: true,
	                        href: 'showForm?_fid=1115&a=' + (getForm.watchId ? '1&twatch_id=' + getForm.watchId : '2&table_pk=' + table_pk + '&table_id=' + getForm.crudTableId)
	                    }
	                });
	            }
	        });
	        xb = true;
	    }
	    if (getForm.keywordFlag) {
	        btn.push({
	            text: '${keyword}' + (getForm.keywordCount > 0 ? ' (' + getForm.keywordCount + ')' : ''),
	            id: 'kw_' + getForm.id,
	            iconAlign: 'top',
	            scale: 'medium',
	            style: {
	                margin: '0px 5px 0px 5px'
	            },
	            iconCls: 'ibig_keyword',
	            handler: function(a, b, c) {
	                var table_pk = '';
	                if (getForm.a == 1) {
	                    for (var key in getForm.pk) {
	                        if (key != 'customizationId') {
	                            table_pk += "|" + getForm.pk[key];
	                        }
	                    }
	                } else table_pk = "|" + getForm.tmpId;
	                var cfg = {
	                    attributes: {
	                        modalWindow: true,
	                        href: 'showPage?_tid=259&_gid1=54',
	                        _pk: {
	                            tkeyword_id: 'keyword_id',
	                            ttable_id: 'table_id',
	                            ttable_pk: 'table_pk'
	                        },
	                        baseParams: {
	                            xtable_id: getForm.crudTableId,
	                            xtable_pk: table_pk.substring(1)
	                        }
	                    }
	                };
	                cfg.attributes._title_ = '${keywords} (' + getForm.name + ')';
	                mainPanel.loadTab(cfg);
	            }
	        });
	        xb = true;
	    }
	    if (getForm.accessControlFlag) {
	        btn.push({
	            text: '${record_security}',
	            id: 'rsec_' + getForm.id,
	            iconAlign: 'top',
	            scale: 'medium',
	            style: {
	                margin: '0px 5px 0px 5px'
	            },
	            iconCls: getForm.accessControlCount > 0 ? 'ibig_locked' : 'ibig_unlocked',
	            handler: function(a, b, c) {
	                var table_pk = '';
	                if (getForm.a == 1) {
	                    for (var key in getForm.pk) {
	                        if (key != 'customizationId') {
	                            table_pk += "|" + getForm.pk[key];
	                        }
	                    }
	                } else table_pk = "|" + getForm.tmpId;
	                var cfg = {
	                    attributes: {
	                        modalWindow: true,
	                        href: 'showPage?_tid=259&_gid1=477&crud_table_id=' + getForm.crudTableId,
	                        _pk: {
	                            access_roles: 'access_roles',
	                            access_users: 'access_users',
	                            paccess_flag: 'access_flag',
	                            paccess_tip: 'val',
	                            ptable_id: '!' + getForm.crudTableId,
	                            ptable_pk: '!' + table_pk.substring(1)
	                        },
	                        baseParams: {
	                            xtable_id: getForm.crudTableId,
	                            xtable_pk: table_pk.substring(1)
	                        }
	                    }
	                };
	                cfg.attributes._title_ = getForm.name
	                mainPanel.loadTab(cfg);
	            }
	        });
	        xb = true;
	    }
	    if (getForm.relationFlag) {
	        if (xb) {
	            btn.push('-');
	            xb = false;
	        }
	        btn.push({
	            text: '${related_record}' + (getForm.relationCount > 0 ? ' (' + getForm.relationCount + ')' : ''),
	            id: 'rrec_' + getForm.id,
	            iconAlign: 'top',
	            scale: 'medium',
	            style: {
	                margin: '0px 5px 0px 5px'
	            },
	            iconCls: 'ibig_relation',
	            handler: function(a, b, c) {
	                var table_pk = '';
	                if (getForm.a == 1) {
	                    for (var key in getForm.pk) {
	                        if (key != 'customizationId') {
	                            table_pk += "|" + getForm.pk[key];
	                        }
	                    }
	                } else table_pk = "|" + getForm.tmpId;
	                var cfg = {
	                    attributes: {
	                        modalWindow: true,
	                        href: 'showPage?_tid=259&_gid1=846',
	                        _pk: {
	                            ttable_related_record_id: 'table_related_record_id'
	                        },
	                        baseParams: {
	                            xtable_id: getForm.crudTableId,
	                            xtable_pk: table_pk.substring(1)
	                        }
	                    }
	                };
	                cfg.attributes._title_ = getForm.name
	                mainPanel.loadTab(cfg);
	            }
	        });
	    }
	    if (getForm.commentFlag) {
	        if (xb) {
	            btn.push('-');
	            xb = false;
	        }
	        var txt2='${comment}' + (getForm.commentCount > 0 ? ' (' + getForm.commentCount + ')': '');
	        if(getForm.commentExtra && getForm.commentExtra.is_new)txt2='<b class="dirtyColor">'+txt2+'</b>';
	        btn.push({
	            text: txt2,
	            id: 'cd_' + getForm.id,
	            iconAlign: 'top',
	            scale: 'medium',listeners:{
					render:function(ax,bx,cx){
						var axx=getForm.commentExtra;
						if(axx){
							//var ax=Ext.getCmp('cd_' + getForm.id);
							var tt=new Ext.ToolTip({
								target: ax.getEl(),
								anchor: 'top',
								html: '<b>' +axx.user_dsc+ '</b>: '+ Ext.util.Format.htmlEncode(axx.msg) + '<br/><span class=cfeed> · '+Ext.util.Format.htmlEncode(axx.last_dttm)+'</span>'
								,dismissDelay: 5000
							});
							if(axx.is_new){
								new Ext.util.DelayedTask(function(){tt.show();}).delay(500);
							}
						}
					}},
	            style: {
	                margin: '0px 5px 0px 5px'
	            },
	            iconCls: 'ibig_comment',
	            handler: function(a, b, c) {
					if(a._commentCount)a.setText('${comment} (' + a._commentCount + ')');else a.setText('${comment}' + (getForm.commentCount > 0 ? ' (' + getForm.commentCount + ')': ''));
	                var table_pk = '';
	                if (getForm.a == 1) {
	                    for (var key in getForm.pk) {
	                        if (key != 'customizationId') {
	                            table_pk += "|" + getForm.pk[key];
	                        }
	                    }
	                } else table_pk = "|" + getForm.tmpId;
	                mainPanel.loadTab({
	                    attributes: {
	                        id:'modal_comment_'+getForm.crudTableId+'-'+table_pk.substring(1),
	                        modalWindow: true,
	                        href: 'showPage?_tid=836',
	                        slideIn: 't',
	                        _title_: getForm.name,
	                        _pk: {
	                            tcomment_id: 'comment_id'
	                        },
	                        baseParams: {
	                            xtable_id: getForm.crudTableId,
	                            xtable_pk: table_pk.substring(1)
	                        }
	                    }
	                });
	            }
	        });
	    }
	    if (getForm.fileAttachFlag && getForm.pictureFlag) {
	        if (xb) {
	            btn.push('-');
	            xb = false;
	        }
	        btn.push({
	            text: '${pictures}' + (getForm.pictureCount > 0 ? ' (' + getForm.pictureCount + ')' : ''),
	            id: 'ap_' + getForm.id,
	            iconAlign: 'top',
	            scale: 'medium',
	            style: {
	                margin: '0px 5px 0px 5px'
	            },
	            iconCls: 'ibig_picture',
	            handler: function(a, b, c) {
	                var table_pk = '',
	                    xtable_id = '';
	                if (getForm.a == 1) {
	                    for (var key in getForm.pk) {
	                        if (key != 'customizationId') {
	                            table_pk += "|" + getForm.pk[key];
	                        }
	                    }
	                } else {
	                    table_pk = "|" + getForm.tmpId;
	                }
	                table_pk = table_pk.substring(1);
	                xtable_id = getForm.crudTableId;
	                var cfg = {
	                    attributes: {
	                        modalWindow: true,
	                        href: 'showPage?_tid=714&table_id=' + xtable_id + '&table_pk=' + table_pk,
	                        _pk: {
	                            tfile_attachment_id: 'file_attachment_id'
	                        },
	                        baseParams: {
	                            table_id: xtable_id,
	                            table_pk: table_pk
	                        }
	                    }
	                };
	                cfg.attributes._title_ = getForm.name
	                mainPanel.loadTab(cfg);
	            }
	        });
	    }
	    if (getForm.commentFlag || getForm.fileAttachFlag) btn.push('-');
	}

	btn.push({
	    text: '${templates}',
	    id: 'ttemp_' + getForm.id,
	    iconAlign: 'top',
	    scale: 'medium',
	    style: {
	        margin: '0px 5px 0px 5px'
	    },
	    iconCls: 'ibookmark',
	    handler: function(a, b, c) {
	        if (!getForm._loaded) {
	            getForm._loaded = true;
	            promisRequest({
	                url: 'ajaxQueryData?_qid=483',
	                params: {
	                    xform_id: getForm.formId
	                },
	                successCallback: function(j) {
	                    if (j.success && j.data.length > 0) {
	                        while (a.menu.items.items.length > 2) a.menu.remove(2);
	                        a.menu.add('-');
	                        var pf = true;
	                        for (var q = 0; q < j.data.length; q++) {
	                            if (j.data[q].public_flag && pf) {
	                                if (q > 0) a.menu.add('-');
	                                pf = false;
	                            }
	                            a.menu.add({
	                                text: j.data[q].dsc,
	                                _id: j.data[q].form_value_id,
	                                handler: function(a, b, c) {
	                                    promisRequest({
	                                        url: 'ajaxQueryData?_qid=503',
	                                        params: {
	                                            xform_value_id: a._id
	                                        },
	                                        successCallback: function(j2) {
	                                            if (j2.success && j2.data.length > 0) {
	                                                var f2 = getForm._cfg.formPanel.getForm()
	                                                var j3 = {}
	                                                for (var q2 = 0; q2 < j2.data.length; q2++) {
	                                                    j3[j2.data[q2].dsc] = j2.data[q2].val
	                                                }
	                                                f2.setValues(j3)
	                                            }
	                                        }
	                                    })
	                                }
	                            })
	                        }
	                    }
	                }
	            })

	        }
	    },
	    menu: {
	        items: [{
	            text: '${save_these_values}',
	            iconCls: 'icon-ekle',
	            handler: function(a, b, c) {
	                var p = prompt('${template_name}', '')
	                if (p) {
	                    var params = getForm._cfg.formPanel.getForm().getValues()
	                    params._dsc = p
	                    promisRequest({
	                        url: 'ajaxBookmarkForm?_fid=' + getForm.formId,
	                        params: params,
	                        successCallback: function() {
	                            getForm._loaded = false;
	                            alert('${saved}')
	                        }
	                    })
	                }
	            }
	        }, {
	            text: '${edit_records}',
	            iconCls: 'icon-duzenle',
	            handler: function(a, b, c) {
	                mainPanel.loadTab({
	                    attributes: {
	                        _title_: getForm.name,
	                        modalWindow: true,
	                        href: 'showPage?_tid=259&_gid1=491',
	                        _pk: {
	                            tform_value_id: 'form_value_id'
	                        },
	                        baseParams: {
	                            xform_id: getForm.formId
	                        }
	                    }
	                })
	            }
	        }]
	    }
	});

	if (_scd.administratorFlag || _scd.customizerFlag) {
	    btn.push('-');
	    var menuItems = []
	    if (_scd.customizerFlag) {
	        menuItems.push({
	            text: '${form_field_settings}',
	            handler: function(a, b, c) {
	                mainPanel.loadTab({
	                    attributes: {
	                        _title_: getForm.name,
	                        _width_: 600,
	                        modalWindow: true,
	                        href: 'showPage?_tid=543&_gid1=439&_fid2=997&a=1&tform_id=' + getForm.formId,
	                        _pk1: {
	                            tform_cell_id: 'form_cell_id'
	                        },
	                        baseParams: {
	                            xform_id: getForm.formId
	                        }
	                    }
	                })
	            }
	        })
	        /*menuItems.push({
	            text: '${lookup_settings}',
	            handler: function(a, b, c) {
	                mainPanel.loadTab({
	                    attributes: {
	                        _title_: getForm.name,
	                        modalWindow: true,
	                        href: 'showPage?_tid=259&_gid1=806&xform_id=' + getForm.formId,
	                        _pk: {
	                            tlook_up_detay_id: 'look_up_detay_id'
	                        }
	                    }
	                })
	            }
	        })*/
	        
	        if (_app.table_action_rule_flag && 1 * _app.table_action_rule_flag) menuItems.push({
	            text: '${table_action}',
	            handler: function(a, b, c) {
	                mainPanel.loadTab({
	                    attributes: {
	                        _title_: getForm.name,
	                        modalWindow: true,
	                        href: 'showPage?_tid=259&_gid1=1835',
	                        _pk: {
	                            ttable_action_rule_id: 'table_action_rule_id'
	                        },
	                        baseParams: {
	                            xtable_id: getForm.crudTableId
	                        }
	                    }
	                })
	            }
	        })
	        if ((_app.mail_flag && 1 * _app.mail_flag) || (_app.sms_flag && 1 * _app.sms_flag)) menuItems.push({
	            text: '${form_sms_mail_settings}' + (getForm.smsMailTemplateCnt ? ' (' + getForm.smsMailTemplateCnt + ')' : ''),
	            handler: function(a, b, c) {
	                mainPanel.loadTab({
	                    attributes: {
	                        _title_: getForm.name,
	                        modalWindow: true,
	                        href: 'showPage?_tid=259&_gid1=1294',
	                        _pk: {
	                            tform_sms_mail_id: 'form_sms_mail_id'
	                        },
	                        baseParams: {
	                            xform_id: getForm.formId,
	                            xtable_id: getForm.crudTableId || ''
	                        }
	                    }
	                })
	            }
	        })
	        if (_app.form_conversion_flag && 1 * _app.form_conversion_flag) menuItems.push({
	            text: '${form_conversion}' + (getForm.conversionCnt ? ' (' + getForm.conversionCnt + ')' : ''),
	            handler: function(a, b, c) {
	                mainPanel.loadTab({
	                    attributes: {
	                        _title_: getForm.name,
	                        modalWindow: true,
	                        href: 'showPage?_tid=259&_gid1=1344',
	                        _pk: {
	                            tconversion_id: 'conversion_id'
	                        },
	                        baseParams: {
	                            xsrc_form_id: getForm.formId,
	                            xtable_id: getForm.crudTableId || ''
	                        }
	                    }
	                })
	            }
	        })
	        if (getForm.extendFlag) menuItems.push({
	            text: '${add_new_field}',
	            iconCls: 'icon-ekle',
	            handler: function(a, b, c) {
	                mainPanel.loadTab({
	                    attributes: {
	                        href: 'showForm?_fid=961&pform_id=' + getForm.formId
	                    }
	                })
	            }
	        })
	    }
	    if (_scd.administratorFlag) {
	        if (menuItems.length > 0) menuItems.push('-');
	        menuItems.push({
	            text: '${field_tab_security}',
	            cls: 'menu-keyword',
	            handler: function(a, b, c) {
	                mainPanel.loadTab({
	                    attributes: {
	                        _title_: getForm.name,
	                        modalWindow: true,
	                        href: 'showPage?_tid=543&_gid1=489&_gid2=804&_fid3='+(!(1*_app.table_user_tip_detail_flag) ? '1000&a=1':('2339&a=9&tuser_tip='+_scd.userTip))+'&ttable_id=' + getForm.crudTableId,
	                        _pk1: {
	                            ttable_field_id: 'table_field_id'
	                        },
	                        _pk2: {
	                            tform_module_id: 'form_module_id'
	                        },
	                        baseParams: {
	                            xform_id: getForm.formId
	                        }
	                    }
	                })
	            }
	        });

	        if (getForm.a == 1 && getForm.mailSettingFlag) menuItems.push({
	            text: '${special_email_account}' + (getForm.mailSettingId > 0 ? 'ni Düzenle' : ' ${add}'),
	            _mailSettingId: getForm.mailSettingId,
	            cls: 'x-grid-mail',
	            handler: function(a, b, c) {
	                var url = 'showForm?_fid=1037';
	                if (a._mailSettingId == 0) {
	                    var table_pk = '';
	                    for (var key in getForm.pk)
	                        if (key != 'customizationId') table_pk += "|" + getForm.pk[key];
	                    url += '&a=2&table_id=' + getForm.crudTableId + '&table_pk=' + table_pk.substring(1);
	                } else {
	                    url += '&a=1&tmail_setting_id=' + a._mailSettingId;
	                }
	                mainPanel.loadTab({
	                    attributes: {
	                        href: url
	                    }
	                })
	            }
	        });
	    }
	    if (_scd.customizerFlag) {
	        menuItems.push('-', {
	            text: '${help_info}',
	            id: 'hi_' + getForm.id,
	            handler: function(a, b, c) {
	                mainPanel.loadTab({
	                    attributes: {
	                        hideCommitBtn: 1,
	                        _title_: getForm.name,
	                        modalWindow: true,
	                        href: 'showPage?_tid=259&_gid1=669',
	                        _pk: {
	                            pform_cell_id: 'form_cell_id',
	                            pcustomization_id: '!' + _scd.customizationId,
	                            plocale: 'locale',
	                            pdsc: 'dsc',
	                            pwidth: 'width',
	                            pheight: 'height'
	                        },
	                        baseParams: {
	                            xform_id: getForm.formId
	                        },
	                        _pk2: {
	                            tform_cell_id: 'form_cell_id',
	                            tlocale: 'locale'
	                        }
	                    }
	                });
	            }
	        }, {
	            text: '${help_form}',
	            id: 'hi_form_' + getForm.id,
	            handler: function(a, b, c) {
	                promisRequest({
	                    url: 'ajaxQueryData?_qid=1745',
	                    params: {
	                        xtable_id: 40,
	                        xtable_pk: getForm.formId,
	                        xlocale: _scd.locale
	                    },
	                    successCallback: function(j) {
	                        var str = (j.data && j.data.length) ? ('a=1&tdoc_id=' + j.data[0].doc_id) : ('a=2&table_id=40&table_pk=' + getForm.formId);
	                        mainPanel.loadTab({
	                            attributes: {
	                                _title_: 'Doc - ' + getForm.name,
	                                modalWindow: true,
	                                href: 'showForm?_fid=1721&' + str
	                            }
	                        });
	                    }
	                })

	            }
	        }, {
	            text: '${form_hints}',
	            handler: function(a, b, c) {
	                mainPanel.loadTab({
	                    attributes: {
	                        _title_: getForm.name,
	                        modalWindow: true,
	                        href: 'showPage?_tid=259&_gid1=1700',
	                        _pk: {
	                            tform_hint_id: 'form_hint_id'
	                        },
	                        baseParams: {
	                            xform_id: getForm.formId
	                        }
	                    }
	                });
	            }
	        })
	    };
	    btn.push({
	        text: '${settings}',
	        id: 'fs_' + getForm.id,
	        iconAlign: 'top',
	        scale: 'medium',
	        style: {
	            margin: '0px 5px 0px 5px'
	        },
	        iconCls: 'isettings',
	        menu: {
	            items: menuItems
	        }
	    });
	}

	var iconCls = getForm.a == 1 ? 'icon-edit' : 'icon-new'

	var o = {
	    autoScroll: true,
	    border: false,
	    tbar: btn,
	    bodyStyle: 'background-color: #FFFFFF;padding:3px;',
	    iconCls: callAttributes.iconCls || iconCls,
	    _title_: callAttributes.title || 'Form: ' + getForm.name,
	    _width_: getForm.defaultWidth,
	    _height_: getForm.defaultHeight
	}
	if (!callAttributes.modalWindowFlag) {
	    o = Ext.apply({ closable: true, title: getForm.name }, o);
	}

	if (getForm.hmsgs) {
	    var hints = getForm.hmsgs;
	    for (var qs = hints.length - 1; qs >= 0; qs--) {
	        var icn = "";
	        switch (hints[qs].tip * 1) {
	            case 1:icn = "information";break;
	            case 2:icn = "warning";break;
	            case 3:icn = "error";break;
	        }
	        var lbl = new Ext.form.Label({ hideLabel: true, html: hints[qs].text, cls: icn });
	        extDef.items.unshift({
	            xtype: 'fieldset',
	            title: '',
	            labelWidth: 0,
	            bodyStyle: 'background-color:' + hints[qs].color + ';',
	            items: [lbl]
	        });
	    }
	}

	if (_app.form_msgs_visible_on_form * 1 == 1 && getForm.msgs) {
	    var lbl = new Ext.form.Label({
	        hideLabel: true,
	        html: getForm.msgs.join("<br>"),
	        cls: 'information'
	    });
	    extDef.items.unshift({
	        xtype: 'fieldset',
	        title: '',
	        labelWidth: 0,
	        bodyStyle: 'background-color:#FFF8C6;',
	        items: [lbl]
	    });
	}
	if (_app.live_sync_record && 1 * _app.live_sync_record && getForm.a==1) extDef.items.unshift({
	    hidden: !getForm.liveSyncBy,
	    xtype: 'fieldset',
	    id: 'live_sync_' + getForm.id,
	    title: '',
	    labelWidth: 0,
	    bodyStyle: 'background-color:#FFF8C6',
	    items: [new Ext.form.Label({
	        hideLabel: true,
	        id: 'live_sync_lbl_' + getForm.id,
	        html: getForm.liveSyncBy ? "Bu Kayit su anda " + getUsers4Chat(getForm.liveSyncBy) + " tarafindan inceleniyor!" : "!",
	        cls: 'information'
	    })]
	});

	var p = new Ext.FormPanel(Ext.apply(o, extDef))
	if (!getForm._cfg) getForm._cfg = {}
	getForm._cfg.formPanel = p;
	getForm._cfg._callAttributes = callAttributes;

	if (_app.form_msgs_visible_on_form * 1 != 1 && getForm.msgs) Ext.infoMsg.msg('${info}', getForm.msgs.join('<br>'), 3);

	if (_app.live_sync_record && 1 * _app.live_sync_record != 0 && extDef.baseParams[".t"]) {
	    p._l = {
	        pk: (1 * getForm.a == 1) ? (getForm.crudTableId + "-" + pk):false
	    }
	}

	return p;
}

