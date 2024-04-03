var kpiExpert_PENDIENTES={};

kpiExpert_PENDIENTES.lastEntity;

kpiExpert_PENDIENTES.eraseChart=function(){ 

    d3.select("#svgTooltip").selectAll(".prodDetail").data([]).exit().remove();   
    d3.select("#svgTooltip3").selectAll(".penDetail").data([]).exit().remove();
    d3.select("#svgTooltip4").selectAll(".penDetail").data([]).exit().remove();

    $("#toolTip2").css("visibility","hidden");
    $("#toolTip3").css("visibility","hidden");
    $("#toolTip4").css("visibility","hidden");
    $("#toolTip5").css("visibility","hidden");
    $("#toolTip6").css("visibility","hidden");
    $("#toolTip7").css("visibility","hidden");

}


kpiExpert_PENDIENTES.DrawTooltipDetail=function(entity){   

    kpiExpert_PENDIENTES.lastEntity=entity;
    
    d3.select("#svgTooltip").selectAll(".penDetail").data([]).exit().remove();
    d3.select("#svgTooltip3").selectAll(".penDetail").data([]).exit().remove();
    d3.select("#svgTooltip4").selectAll(".penDetail").data([]).exit().remove();

    $("#toolTip2").css("visibility","hidden");
    $("#toolTip3").css("visibility","hidden");
    $("#toolTip4").css("visibility","hidden");
    $("#toolTip5").css("visibility","hidden");
    $("#toolTip6").css("visibility","hidden");
    $("#toolTip7").css("visibility","hidden");

    kpiExpert_PENDIENTES.registredWindows=[];

    kpiExpert_PENDIENTES.DrawTooltipDetail_Tipo(entity);
    kpiExpert_FR.registredWindows.push("#toolTip2");

    kpiExpert_PENDIENTES.DrawTooltipDetail_Dia(entity);
    kpiExpert_FR.registredWindows.push("#toolTip3");


    //Ventanas segun nivel de lectura:
    
    if($("#nivel_cb").val() < 3){ // Nacional o regiones
        kpiExpert_PENDIENTES.registredWindows.push("toolTip4");
        kpiExpert_PENDIENTES.DrawTooltipDetail_Estado(entity);
    }

    if($("#nivel_cb").val() ==3 || $("#nivel_cb").val() ==4 ){ // estado o gerencia 
        kpiExpert_PENDIENTES.registredWindows.push("#toolTip6");
        kpiExpert_PENDIENTES.DrawTooltipDetail_GenericFr(entity,"UnidadNegocio","cat_un");
    }

    if($("#nivel_cb").val() == 3 ){// estado 
       
    }

    if($("#nivel_cb").val() == 5  ){//  UN 
        kpiExpert_PENDIENTES.registredWindows.push("toolTip4");
        kpiExpert_PENDIENTES.DrawTooltipDetail_Estado(entity);
    }

    if($("#nivel_cb").val() == 7 ){// ZT debe ver holding
        kpiExpert_PENDIENTES.registredWindows.push("#toolTip7");
        kpiExpert_PENDIENTES.DrawTooltipDetail_GenericFr2(entity,"Holding","cat_cliente_estado");
    }

    if($("#nivel_cb").val() == 6 ){// Holding debe ver sucrusal
        kpiExpert_PENDIENTES.registredWindows.push("#toolTip7");
        kpiExpert_PENDIENTES.DrawTooltipDetail_GenericFr2(entity,"Obra","cat_sucursal_estado");
    }

    if($("#nivel_cb").val() == 8 ){// Sucrusal-Obra debe ver frente
        kpiExpert_PENDIENTES.registredWindows.push("#toolTip7");
            kpiExpert_PENDIENTES.DrawTooltipDetail_GenericFr2(entity,"Frente","cat_frente");
    }

    //********************************************************************** */     

    opacidadCesium=30;
      $("#cesiumContainer").css("opacity",opacidadCesium/100); 

    vix_tt_distributeDivs(["#toolTip2","#toolTip3"]);
   

}

kpiExpert_PENDIENTES.registredWindows=[];
kpiExpert_PENDIENTES.sortRegistredWindows=function(){

  vix_tt_distributeDivs(kpiExpert_PENDIENTES.registredWindows); 

}

kpiExpert_PENDIENTES.DrawTooltipDetail_GenericFr=function(entity, agrupador ,catlog){  

    $("#cargando").css("visibility","visible");

    var serviceName;
    var apiURL;
    var agrupador=agrupador;    
  
    for(var i=0; i < store.apiDataSources.length; i++){
          
        if(store.apiDataSources[i].varName=="pendientes"){
           
            serviceName=store.apiDataSources[i].serviceName;
            apiURL=store.apiDataSources[i].apiURL;
        }

    }

    if(serviceName && apiURL){

        var dateInit_=dateInit.getFullYear()+"-"+String(Number(dateInit.getMonth())+1)+"-"+dateInit.getDate();
        var dateEnd_=dateEnd.getFullYear()+"-"+String(Number(dateEnd.getMonth())+1)+"-"+dateEnd.getDate();
       
        // FILTROS****
        var params="";

        for(var j=0; j < store.catlogsForFilters.length; j++){ 
    
            if(  3 == $("#nivel_cb").val()  &&  store.catlogsForFilters[j].storeProcedureField=="EstadoZTDem" ){ // Estado

                params+="&EstadoZTDem="+entity.key;
                continue;
              }

              if( 4 == $("#nivel_cb").val()  &&  store.catlogsForFilters[j].storeProcedureField=="GerenciaUN" ){ // Gerencia
                params+="&GerenciaUN="+entity.key;
                continue;
              }

              if(  5 == $("#nivel_cb").val()  &&  store.catlogsForFilters[j].storeProcedureField=="vc50_UN_Tact" ){ // UN
                      params+="&vc50_UN_Tact="+entity.key;
                      continue;
              }

              if(  6 == $("#nivel_cb").val()  &&  store.catlogsForFilters[j].storeProcedureField=="Cliente"  && !params.includes("&Cliente=") ){ // Holding

                var nombre=entity.key;
                if(entity.key.indexOf("_")>-1){
                  var nombrepSplit=entity.key.split("_");
                  nombre=nombrepSplit[0];
                }

                if(params.indexOf("&Cliente=") > -1)
                continue;

                params+="&Cliente="+nombre;
                  continue;
              }
              if(  7 == $("#nivel_cb").val()  &&  store.catlogsForFilters[j].storeProcedureField=="Zona_de_Entrega" ){ // ZT
                  params+="&ZonaTransporte="+entity.key;
                  continue;
              } 
              if(  8 == $("#nivel_cb").val()  &&  store.catlogsForFilters[j].storeProcedureField=="Obra" && params.indexOf("Obra") < 0  ){ // Obra

                  var nombre=entity.key;
                  if(entity.key.indexOf("_")>-1){
                    var nombrepSplit=entity.key.split("_");
                    nombre=nombrepSplit[0];
                  }

                  params+="&Obra="+nombre;
                  continue;
              } 
              if(  9 == $("#nivel_cb").val() &&  store.catlogsForFilters[j].storeProcedureField=="Frente"  ){ // Frente
                params+="&Frente="+entity.key;
                continue;
              }  

              if($("#"+store.catlogsForFilters[j].id).val() != "" && $("#"+store.catlogsForFilters[j].id).val() != undefined && $("#"+store.catlogsForFilters[j].id).val() != "Todos" ){

                  params+="&"+store.catlogsForFilters[j].storeProcedureField+"="+store.catlogsForFilters[j].diccNames[ $("#"+store.catlogsForFilters[j].id).val() ];

              }
  
         }
         
        if(String($("#nivel_cb").val()) == "0"){

                if(entity.key.toLowerCase()=="sacos"){
                        params+="&Presentacion=Sacos";
                }else if(entity.key.toLowerCase()=="granel"){
                        params+="&Presentacion=Granel";
                }

        }

        //FILTRO DE MASIVO
        if($("#masivos_cb").val() == "Todos" || $("#masivos_cb").val() == ""){

                    params+="&masivos=Todos";               

        }else if($("#masivos_cb").val() == "SinMasivos"){

                    params+="&masivos=Sin Masivos"; 

        }else if($("#masivos_cb").val() == "SoloMasivos"){

                    params+="&masivos=Solo Masivos"; 
                    
        }

        console.log("params",params);

        var URL=apiURL+"/"+serviceName+"&fechaInicio="+dateInit_+"&fechaFin="+dateEnd_+"&agrupador="+agrupador+""+params;
        console.log(URL);

        if(URL.indexOf("undefined" < 0)){

            dataLoader.AddLoadingTitle("Pendientes por "+agrupador);

            d3.json(URL, function (error, data) {

                $("#cargando").css("visibility","hidden");

                dataLoader.DeleteLoadingTitle("Pendientes por "+agrupador); 

                dataLoader.HideLoadings();

                if(error){
                        alert("Error API Pendientes por "+agrupador,error);                     
                        return;
                }

                if(data.error){
                        alert("Error API Pendientes por "+agrupador,data.error);                      
                        return;
                }

                console.log("Pendientes por "+agrupador,data.recordset);

                var dataTemp=[];
                var ultimaFecha=0;

                for(var j=0;  j < data.recordset.length; j++){

                    if(data.recordset[j].FechaActual!=""){

                        if( data.recordset[j].FechaActual.indexOf("T") > -1){
    
                            var fechaSplit=data.recordset[j].FechaActual.split("T");
                            
                            fechaSplit=fechaSplit[0].split("-");                   
    
                        }else{
                            
                            var fechaSplit=data.recordset[j].FechaActual.split("-");
      
                        }                   
    
                        data.recordset[j].fecha= new Date(Number(fechaSplit[0]),Number(fechaSplit[1])-1 ,Number(fechaSplit[2])); 

                        if(ultimaFecha < data.recordset[j].fecha.getTime())
                            ultimaFecha = data.recordset[j].fecha.getTime();
                        
                    } 

                }

                for(var j=0;  j < data.recordset.length; j++){

                    if( data.recordset[j].fecha.getTime() == ultimaFecha ){          
                 
                        dataTemp.push( data.recordset[j] );                                           
        
                    }

                }

                data.recordset=dataTemp;


                var maximo1=0;
                var maximo2=0;

                var arrTemp=[];

                var arr=d3.nest()
                    .key(function(d) { return d.Agrupador; })
                    .entries(data.recordset);  

                for(var i=0; i < arr.length; i++ ){

                    arr[i].Libre_Pendiente_Hoy=0;
                    arr[i].Libre_Retrasado=0;

                    for(var j=0; j < arr[i].values.length; j++ ){        
                    
                        arr[i].Libre_Pendiente_Hoy+=Number(arr[i].values[j].Libre_Pendiente_Hoy);
                        arr[i].Libre_Retrasado+=Number(arr[i].values[j].Libre_Retrasado);
            
                    }

                    if(maximo1 < arr[i].Libre_Pendiente_Hoy){
                        maximo1 = arr[i].Libre_Pendiente_Hoy;
                    }
            
                    if(maximo2 < arr[i].Libre_Retrasado){
                        maximo2= arr[i].Libre_Retrasado;
                    }

                }

                arr = arr.sort((a, b) => b.Libre_Pendiente_Hoy - a.Libre_Pendiente_Hoy);    
                //arr.reverse();

                var altura=30;
                var caso=0;

                var svgTooltipHeight=(arr.length*altura*.5 );

                if(svgTooltipHeight<80)
                    svgTooltipHeight=80;

                if(svgTooltipHeight>windowHeight*.7)
                    svgTooltipHeight=windowHeight*.7;

                var svgTooltipWidth=530;
                var marginLeft=svgTooltipWidth*.2;
                var tamanioFuente=altura*.4;
                var marginTop=35;                                    

                $("#toolTip6").css("visibility","visible");  
                $("#toolTip6").css("inset","");      
                $("#toolTip6").css("left",radio*.7+"px");
                $("#toolTip6").css("top","50px");

                if(svgTooltipHeight > 400){
                    $("#toolTip6").css("top","");
                    $("#toolTip6").css("bottom","10px");
                }                               

                // DATOS 
                var data = arr.map(function(item) {
                    return {
                    key: item.key,
                    "Libre_Pendiente_Hoy": item.Libre_Pendiente_Hoy,
                    "Libre_Retrasado": item.Libre_Retrasado,
                   
                    };
                    });


                // DEFINE COLUMNAS      
                var columns = [
                    { key: "key", header:agrupador, sortable: true, width: "230px" },
                    { key: "Libre_Pendiente_Hoy", header: "Libre Pendiente Hoy", sortable: true, width: "160px" },
                    { key: "Libre_Retrasado", header: "Libre Retrasado", sortable: true, width: "160px" },
                  
                ];

                // DEFINE VISITORS PARA CADA COLUMNA   
                var columnVisitors = {
                    key: function(value) {

                        var nombre=dataManager.getNameFromIdFromCatlog(value , catlog);

                        if(nombre.length > 31)
                                    nombre=nombre.substr(0,31)+"...";

                        return `<div class="key-selector" onclick="backInfoNav.push({entity:'${entity.key}' , catlog:'${dataManager.getCurrentCatlog()}'});filterControls.arrowUpdate();filterControls.lookForEntity('${value}','${catlog}','${entity.key}')">${nombre}
                        </div>`;
                    },                                   
                   
                    Libre_Pendiente_Hoy: function(value){
                
                        var barWidth = (value/maximo1)*100 + '%';
                        var barValue = vix_tt_formatNumber(value)+'';
                    
                        return '<div class="bar-container">' +
                        '<span class="bar-value">' + barValue + '</span>' + '<svg width="90%" height="10">'  
                        + '<rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: #0096E3;"></rect></svg>' +        
                        '</div>';
                    },
                    Libre_Retrasado: function(value){
                
                        var barWidth = (value/maximo1)*100 + '%';
                        var barValue = vix_tt_formatNumber(value)+'';
                
                    return '<div class="bar-container">' +
                    '<span class="bar-value">' + barValue + '</span>' + '<svg width="90%" height="10">'  
                    + '<rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: #0096E3;"></rect></svg>' +        
                    '</div>';
                    }
                };

                // FORMATEA DIV :
                vix_tt_formatToolTip("#toolTip6","Pendientes por "+agrupador+" de "+dataManager.getNameFromId(entity.key)+" (TM)",480,svgTooltipHeight+130,dataManager.GetTooltipInfoData("toolTip6","Pendientes"));

                // COLUMNAS CON TOTALES :
                var columnsWithTotals = ['Libre_Pendiente_Hoy','Libre_Retrasado']; 
                var totalsColumnVisitors = {
                            'Libre_Pendiente_Hoy': function(value) { 
                            return vix_tt_formatNumber(value) ;
                            },
                            'Libre_Retrasado': function(value) { 
                            return vix_tt_formatNumber(value) ; 
                            }
                            };  

               // CREA TABLA USANDO DATOS

                vix_tt_table_extended(data, columns, columnVisitors, totalsColumnVisitors, "toolTip6", columnsWithTotals );        

                // Crea una barra inferior y pasa una funcion de exportacion de datos
                    vix_tt_formatBottomBar("#toolTip6", function () {
                    var dataToExport = formatDataForExport(data, columns);
                    var filename = "exported_data";
                    exportToExcel(dataToExport, filename);
                });
                // APLICA TRANSICIONES
                vix_tt_transitionRectWidth("toolTip6");

                 // DISTRIBUYE 
                 kpiExpert_PENDIENTES.sortRegistredWindows(); 

                 //Agrega boton para abrir detalle por Cliente
                 $("#toolTip6").find(".content").css("align-items","");
                $("#toolTip6").find(".content").append(`<div class="item2 loginContainer login-page form " style="background-color: rgba(0,0,0,0);position:relative;margin:0px;left:0px;padding:3px;z-index:9999;visibility:visible;"><button id="getdata" style="margin:10px;width:90%" class="loginBtn" onclick="kpiExpert_PENDIENTES.registredWindows.push('#toolTip7');
                kpiExpert_PENDIENTES.DrawTooltipDetail_GenericFr2(kpiExpert_PENDIENTES.lastEntity,'Holding','cat_cliente_estado');$('#toolTip6').find('.content').find('#getdata').css('visibility','hidden')">Mostrar Detalle por CLiente</button>   </div>`);

                //HAce mas alto
                $("#toolTip6").css("height",(Number($("#toolTip6").css("height").replaceAll("px",""))+80)+"px");

                //Alinea elementos nuevos
                $("#toolTip6").find(".content").css("display","flex");
                $("#toolTip6").find(".content").css("align-items","center");
                $("#toolTip6").find(".content").css("flex-direction","column");
      

            });

        }
    }

}


kpiExpert_PENDIENTES.DrawTooltipDetail_GenericFr2=function(entity, agrupador ,catlog){  

    $("#cargando").css("visibility","visible");

    var serviceName;
    var apiURL;
    var agrupador=agrupador;    
  
    for(var i=0; i < store.apiDataSources.length; i++){
          
        if(store.apiDataSources[i].varName=="pendientes"){
           
            serviceName=store.apiDataSources[i].serviceName;
            apiURL=store.apiDataSources[i].apiURL;
        }

    }

    if(serviceName && apiURL){

        var dateInit_=dateInit.getFullYear()+"-"+String(Number(dateInit.getMonth())+1)+"-"+dateInit.getDate();
        var dateEnd_=dateEnd.getFullYear()+"-"+String(Number(dateEnd.getMonth())+1)+"-"+dateEnd.getDate();
       
        // FILTROS****
        var params="";

        for(var j=0; j < store.catlogsForFilters.length; j++){ 
    
            if(  3 == $("#nivel_cb").val()  &&  store.catlogsForFilters[j].storeProcedureField=="EstadoZTDem" ){ // Estado

                params+="&EstadoZTDem="+entity.key;
                continue;
              }

              if( 4 == $("#nivel_cb").val()  &&  store.catlogsForFilters[j].storeProcedureField=="GerenciaUN" ){ // Gerencia
                params+="&GerenciaUN="+entity.key;
                continue;
            }

              if(  5 == $("#nivel_cb").val()  &&  store.catlogsForFilters[j].storeProcedureField=="vc50_UN_Tact" ){ // UN
                      params+="&vc50_UN_Tact="+entity.key;
                      continue;
              }

              if(  6 == $("#nivel_cb").val()  &&  store.catlogsForFilters[j].storeProcedureField=="Cliente"  && !params.includes("&Cliente=") ){ // Holding

                var nombre=entity.key;
                if(entity.key.indexOf("_")>-1){
                  var nombrepSplit=entity.key.split("_");
                  nombre=nombrepSplit[0];
                }

                if(params.indexOf("&Cliente=") > -1)
                continue;

                params+="&Cliente="+nombre;
                  continue;
              }
              if(  7 == $("#nivel_cb").val()  &&  store.catlogsForFilters[j].storeProcedureField=="ZonaTransporte" ){ // ZT
                  params+="&ZonaTransporte="+entity.key;
                  continue;
              } 
              if(  8 == $("#nivel_cb").val()  &&  store.catlogsForFilters[j].storeProcedureField=="Obra" && params.indexOf("Obra") < 0  ){ // Obra

                  var nombre=entity.key;
                  if(entity.key.indexOf("_")>-1){
                    var nombrepSplit=entity.key.split("_");
                    nombre=nombrepSplit[0];
                  }

                  params+="&Obra="+nombre;
                  continue;
              } 
              if(  9 == $("#nivel_cb").val() &&  store.catlogsForFilters[j].storeProcedureField=="Frente"  ){ // Frente
                params+="&Frente="+entity.key;
                continue;
              }  

              if($("#"+store.catlogsForFilters[j].id).val() != "" && $("#"+store.catlogsForFilters[j].id).val() != undefined && $("#"+store.catlogsForFilters[j].id).val() != "Todos" ){

                  params+="&"+store.catlogsForFilters[j].storeProcedureField+"="+store.catlogsForFilters[j].diccNames[ $("#"+store.catlogsForFilters[j].id).val() ];

              }
  
         }
         
        if(String($("#nivel_cb").val()) == "0"){

                if(entity.key.toLowerCase()=="sacos"){
                        params+="&Presentacion=Sacos";
                }else if(entity.key.toLowerCase()=="granel"){
                        params+="&Presentacion=Granel";
                }

        }

        //FILTRO DE MASIVO
        if($("#masivos_cb").val() == "Todos" || $("#masivos_cb").val() == ""){

                    params+="&masivos=Todos";               

        }else if($("#masivos_cb").val() == "SinMasivos"){

                    params+="&masivos=Sin Masivos"; 

        }else if($("#masivos_cb").val() == "SoloMasivos"){

                    params+="&masivos=Solo Masivos"; 
                    
        }

        var URL=apiURL+"/"+serviceName+"&fechaInicio="+dateInit_+"&fechaFin="+dateEnd_+"&agrupador="+agrupador+""+params;
        console.log(URL);

        if(URL.indexOf("undefined" < 0)){

            dataLoader.AddLoadingTitle("Pendientes por "+agrupador);

            d3.json(URL, function (error, data) {

                $("#cargando").css("visibility","hidden");

                dataLoader.DeleteLoadingTitle("Pendientes por "+agrupador); 

                dataLoader.HideLoadings();

                if(error){
                        alert("Error API Pendientes por "+agrupador,error);                     
                        return;
                }

                if(data.error){
                        alert("Error API Pendientes por "+agrupador,data.error);                      
                        return;
                }

                console.log("Pendientes por "+agrupador,data.recordset);

                var dataTemp=[];
                var ultimaFecha=0;

                for(var j=0;  j < data.recordset.length; j++){

                    if(data.recordset[j].FechaActual!=""){

                        if( data.recordset[j].FechaActual.indexOf("T") > -1){
    
                            var fechaSplit=data.recordset[j].FechaActual.split("T");
                            
                            fechaSplit=fechaSplit[0].split("-");                   
    
                        }else{
                            
                            var fechaSplit=data.recordset[j].FechaActual.split("-");
      
                        }                   
    
                        data.recordset[j].fecha= new Date(Number(fechaSplit[0]),Number(fechaSplit[1])-1 ,Number(fechaSplit[2])); 

                        if(ultimaFecha < data.recordset[j].fecha.getTime())
                            ultimaFecha = data.recordset[j].fecha.getTime();
                        
                    } 

                }

                for(var j=0;  j < data.recordset.length; j++){

                    if( data.recordset[j].fecha.getTime() == ultimaFecha ){          
                 
                        dataTemp.push( data.recordset[j] );                                           
        
                    }

                }

                data.recordset=dataTemp;

                var maximo1=0;
                var maximo2=0;

                var arrTemp=[];

                var arr=d3.nest()
                    .key(function(d) { return d.Agrupador; })
                    .entries(data.recordset);  

                for(var i=0; i < arr.length; i++ ){

                    arr[i].Libre_Pendiente_Hoy=0;
                    arr[i].Libre_Retrasado=0;

                    for(var j=0; j < arr[i].values.length; j++ ){        
                    
                        arr[i].Libre_Pendiente_Hoy+=Number(arr[i].values[j].Libre_Pendiente_Hoy);
                        arr[i].Libre_Retrasado+=Number(arr[i].values[j].Libre_Retrasado);
            
                    }

                    if(maximo1 < arr[i].Libre_Pendiente_Hoy){
                        maximo1 = arr[i].Libre_Pendiente_Hoy;
                    }
            
                    if(maximo2 < arr[i].Libre_Retrasado){
                        maximo2= arr[i].Libre_Retrasado;
                    }

                }

                arr = arr.sort((a, b) => b.Libre_Pendiente_Hoy - a.Libre_Pendiente_Hoy);    
                //arr.reverse();

                var altura=30;
                var caso=0;

                var svgTooltipHeight=(arr.length*altura*.5 );

                if(svgTooltipHeight<80)
                    svgTooltipHeight=80;

                if(svgTooltipHeight>windowHeight*.7)
                    svgTooltipHeight=windowHeight*.7;

                var svgTooltipWidth=530;
                var marginLeft=svgTooltipWidth*.2;
                var tamanioFuente=altura*.4;
                var marginTop=35;                                    

                $("#toolTip7").css("visibility","visible");  
                $("#toolTip7").css("inset","");      
                $("#toolTip7").css("left",radio*.7+"px");
                $("#toolTip7").css("top","50px");

                if(svgTooltipHeight > 400){
                    $("#toolTip7").css("top","");
                    $("#toolTip7").css("bottom","10px");
                }                               

                // DATOS 
                var data = arr.map(function(item) {
                    return {
                    key: item.key,
                    "Libre_Pendiente_Hoy": item.Libre_Pendiente_Hoy,
                    "Libre_Retrasado": item.Libre_Retrasado,
                   
                    };
                    });


                // DEFINE COLUMNAS      
                var columns = [
                    { key: "key", header:agrupador, sortable: true, width: "230px" },
                    { key: "Libre_Pendiente_Hoy", header: "Libre Pendiente Hoy", sortable: true, width: "160px" },
                    { key: "Libre_Retrasado", header: "Libre Retrasado", sortable: true, width: "160px" },
                  
                ];

                // DEFINE VISITORS PARA CADA COLUMNA   
                var columnVisitors = {
                    key: function(value) {

                        var nombre=dataManager.getNameFromIdFromCatlog(value , catlog);

                        if(nombre.length > 31)
                                    nombre=nombre.substr(0,31)+"...";

                        return `<div class="key-selector" onclick="backInfoNav.push({entity:'${entity.key}' , catlog:'${dataManager.getCurrentCatlog()}'});filterControls.arrowUpdate();filterControls.lookForEntity('${value}','${catlog}','${entity.key}')">${nombre}
                        </div>`;
                    },                                   
                   
                    Libre_Pendiente_Hoy: function(value){
                
                        var barWidth = (value/maximo1)*100 + '%';
                        var barValue = vix_tt_formatNumber(value)+'';
                    
                        return '<div class="bar-container">' +
                        '<span class="bar-value">' + barValue + '</span>' + '<svg width="90%" height="10">'  
                        + '<rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: #0096E3;"></rect></svg>' +        
                        '</div>';
                    },
                    Libre_Retrasado: function(value){
                
                        var barWidth = (value/maximo1)*100 + '%';
                        var barValue = vix_tt_formatNumber(value)+'';
                
                    return '<div class="bar-container">' +
                    '<span class="bar-value">' + barValue + '</span>' + '<svg width="90%" height="10">'  
                    + '<rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: #0096E3;"></rect></svg>' +        
                    '</div>';
                    }
                };

                // FORMATEA DIV :
                vix_tt_formatToolTip("#toolTip7","Pendientes por "+agrupador+" de "+dataManager.getNameFromId(entity.key)+" (TM)",480,svgTooltipHeight+250,dataManager.GetTooltipInfoData("toolTip7","Pendientes"));

                // COLUMNAS CON TOTALES :
                var columnsWithTotals = ['Libre_Pendiente_Hoy','Libre_Retrasado']; 
                var totalsColumnVisitors = {
                            'Libre_Pendiente_Hoy': function(value) { 
                            return vix_tt_formatNumber(value) ;
                            },
                            'Libre_Retrasado': function(value) { 
                            return vix_tt_formatNumber(value) ; 
                            }
                            };  

               // CREA TABLA USANDO DATOS

                vix_tt_table_extended(data, columns, columnVisitors, totalsColumnVisitors, "toolTip7", columnsWithTotals );        

                // Crea una barra inferior y pasa una funcion de exportacion de datos
                    vix_tt_formatBottomBar("#toolTip7", function () {
                    var dataToExport = formatDataForExport(data, columns);
                    var filename = "exported_data";
                    exportToExcel(dataToExport, filename);
                });
                // APLICA TRANSICIONES
                vix_tt_transitionRectWidth("toolTip7");

                 // DISTRIBUYE 
                 kpiExpert_PENDIENTES.sortRegistredWindows(); 

            });

        }
    }

}

kpiExpert_PENDIENTES.DrawTooltipDetail_Estado=function(entity){    

            $("#cargando").css("visibility","visible");

            var serviceName;
            var apiURL;
            var agrupador="";
            var nombreCatalogoParaDiccionario;
            var diccionarioNombres=[];

            for(var i=0; i < store.niveles.length; i++){    

                    if( store.niveles[i].id == $("#nivel_cb").val() ){
                            agrupador=store.niveles[i].storeProcedureField; 
                            nombreCatalogoParaDiccionario=store.niveles[i].coordinatesSource;
                    }                        
            }

            for( var i=0; i < store.catlogsForFilters.length; i++ ){    
                    if(store.catlogsForFilters[i].data==nombreCatalogoParaDiccionario){
                            diccionarioNombres=store.catlogsForFilters[i].diccNames;
                            
                    }
            } 
            
            for(var i=0; i < store.apiDataSources.length; i++){
          
                if(store.apiDataSources[i].varName=="pendientesEstado"){
                        
                        serviceName=store.apiDataSources[i].serviceName;
                        apiURL=store.apiDataSources[i].apiURL;
                }

            }

            if(serviceName && apiURL){

                var dateInit_=dateInit.getFullYear()+"-"+String(Number(dateInit.getMonth())+1)+"-"+dateInit.getDate();
                var dateEnd_=dateEnd.getFullYear()+"-"+String(Number(dateEnd.getMonth())+1)+"-"+dateEnd.getDate();
                       
                // FILTROS****
                var params="";
                       
                for(var j=0; j < store.catlogsForFilters.length; j++){
    
                    if($("#"+store.catlogsForFilters[j].id).val() != "" && $("#"+store.catlogsForFilters[j].id).val() != undefined && $("#"+store.catlogsForFilters[j].id).val() != "Todos" ){
    
                        params+="&"+store.catlogsForFilters[j].storeProcedureField+"="+store.catlogsForFilters[j].diccNames[ $("#"+store.catlogsForFilters[j].id).val() ];
    
                    }
    
                }

                //FILTRO DE MASIVO
                if($("#masivos_cb").val() == "Todos" || $("#masivos_cb").val() == ""){

                        params+="&masivos=Todos";               

                }else if($("#masivos_cb").val() == "SinMasivos"){

                        params+="&masivos=Sin Masivos"; 

                }else if($("#masivos_cb").val() == "SoloMasivos"){

                        params+="&masivos=Solo Masivos"; 
                        
                }

                //ID de entidad
                params+="&idSpider="+entity.key;

                var URL=apiURL+"/"+serviceName+"?fechaInicio="+dateInit_+"&fechaFin="+dateEnd_+"&agrupador="+agrupador+""+params;
                console.log(URL);  

                if(URL.indexOf("undefined" < 0)){

                    dataLoader.AddLoadingTitle("Pendientes por Estado");

                    d3.json(URL, function (error, data) {

                                    dataLoader.DeleteLoadingTitle("Pendientes por Estado"); 

                                    dataLoader.HideLoadings();

                                    $("#cargando").css("visibility","hidden");

                                    if(error){
                                        alert("Error API Pendientes Estados",error);
                                        resolve();
                                        return;
                                    }

                                    if(data.error){
                                        alert("Error API Pendientes Estados",data.error);
                                        resolve();
                                        return;
                                    }

                                    console.log("Pendientes Estados",data.recordset); 

                                    var maximo1=0;
                                    var maximo2=0;

                                    var arrTemp=[];

                                    var arr=d3.nest()
                                        .key(function(d) { return d.EstadoDem; })
                                        .entries(data.recordset);  

                                    for(var i=0; i < arr.length; i++ ){

                                        arr[i].Libre_Pendiente_Hoy=0;
                                        arr[i].Libre_Retrasado=0;

                                        for(var j=0; j < arr[i].values.length; j++ ){        
                                        
                                            arr[i].Libre_Pendiente_Hoy+=Number(arr[i].values[j].Libre_Pendiente_Hoy);
                                            arr[i].Libre_Retrasado+=Number(arr[i].values[j].Libre_Retrasado);
                                
                                        }

                                        if(maximo1 < arr[i].Libre_Pendiente_Hoy){
                                            maximo1 = arr[i].Libre_Pendiente_Hoy;
                                        }
                                
                                        if(maximo2 < arr[i].Libre_Retrasado){
                                            maximo2= arr[i].Libre_Retrasado;
                                        }

                                    }

                                    arr = arr.sort((a, b) => b.Libre_Pendiente_Hoy - a.Libre_Pendiente_Hoy);    
                                    //arr.reverse();

                                    var altura=30;
                                    var caso=0;

                                    var svgTooltipHeight=(arr.length*altura*.5 );

                                    if(svgTooltipHeight<80)
                                        svgTooltipHeight=80;

                                    if(svgTooltipHeight>windowHeight*.7)
                                        svgTooltipHeight=windowHeight*.7;

                                    var svgTooltipWidth=430;
                                    var marginLeft=svgTooltipWidth*.2;
                                    var tamanioFuente=altura*.4;
                                    var marginTop=35;                                    

                                    $("#toolTip4").css("visibility","visible");  
                                    $("#toolTip4").css("inset","");      
                                    $("#toolTip4").css("left",radio*.7+"px");
                                    $("#toolTip4").css("top","50px");

                                    if(svgTooltipHeight > 400){
                                        $("#toolTip4").css("top","");
                                        $("#toolTip4").css("bottom","10px");
                                    }                               

                                    // DATOS 
                                    var data = arr.map(function(item) {
                                        return {
                                        key: item.key,
                                        "Libre_Pendiente_Hoy": item.Libre_Pendiente_Hoy,
                                        "Libre_Retrasado": item.Libre_Retrasado,
                                       
                                        };
                                        });


                                    // DEFINE COLUMNAS      
                                    var columns = [
                                        { key: "key", header: "Estado", sortable: true, width: "130px" },
                                        { key: "Libre_Pendiente_Hoy", header: "Libre Pendiente Hoy", sortable: true, width: "160px" },
                                        { key: "Libre_Retrasado", header: "Libre Retrasado", sortable: true, width: "160px" },
                                      
                                    ];

                                    // DEFINE VISITORS PARA CADA COLUMNA   
                                    var columnVisitors = {
                                        key: function(value) {
                                            return `<div class="key-selector" onclick="backInfoNav.push({entity:'${entity.key}' , catlog:'${dataManager.getCurrentCatlog()}'});filterControls.arrowUpdate();filterControls.lookForEntity('${value}','cat_estado','${entity.key}')">${value}
                                            </div>`;
                                        },                                   
                                       
                                        Libre_Pendiente_Hoy: function(value){
                                    
                                            var barWidth = (value/maximo1)*100 + '%';
                                            var barValue = vix_tt_formatNumber(value)+'';
                                        
                                            return '<div class="bar-container">' +
                                            '<span class="bar-value">' + barValue + '</span>' + '<svg width="90%" height="10">'  
                                            + '<rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: #0096E3;"></rect></svg>' +        
                                            '</div>';
                                        },
                                        Libre_Retrasado: function(value){
                                    
                                            var barWidth = (value/maximo1)*100 + '%';
                                            var barValue = vix_tt_formatNumber(value)+'';
                                    
                                        return '<div class="bar-container">' +
                                        '<span class="bar-value">' + barValue + '</span>' + '<svg width="90%" height="10">'  
                                        + '<rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: #0096E3;"></rect></svg>' +        
                                        '</div>';
                                        }
                                    };

                                    // FORMATEA DIV :
                                    vix_tt_formatToolTip("#toolTip4","Pendientes por Estado de "+dataManager.getNameFromId(entity.key)+" (TM)",480,svgTooltipHeight+110,dataManager.GetTooltipInfoData("toolTip4","Retrasados"));

                                    // COLUMNAS CON TOTALES :
                                    var columnsWithTotals = ['Libre_Pendiente_Hoy','Libre_Retrasado']; 
                                    var totalsColumnVisitors = {
                                                'Libre_Pendiente_Hoy': function(value) { 
                                                return vix_tt_formatNumber(value) ;
                                                },
                                                'Libre_Retrasado': function(value) { 
                                                return vix_tt_formatNumber(value) ; 
                                                }
                                                };   
    
     
    
                                   // CREA TABLA USANDO DATOS
      
                                    vix_tt_table_extended(data, columns, columnVisitors, totalsColumnVisitors, "toolTip4", columnsWithTotals );        

                                    // Crea una barra inferior y pasa una funcion de exportacion de datos
                                        vix_tt_formatBottomBar("#toolTip4", function () {
                                        var dataToExport = formatDataForExport(data, columns);
                                        var filename = "exported_data";
                                        exportToExcel(dataToExport, filename);
                                    });
                                    // APLICA TRANSICIONES
                                    vix_tt_transitionRectWidth("toolTip4");

                                     // DISTRIBUYE 
                                    vix_tt_distributeDivs(["#toolTip4","#toolTip2","#toolTip3"]); 


                                    //Agrega boton para abrir detalle por Cliente
                                    $("#toolTip4").find(".content").css("align-items","");
                                    $("#toolTip4").find(".content").append(`<div class="item2 loginContainer login-page form " style="background-color: rgba(0,0,0,0);position:relative;margin:0px;left: 0px;padding:3px;z-index:9999;visibility:visible;"><button id="getdata" style="margin:10px;width:90%" class="loginBtn" onclick="kpiExpert_PENDIENTES.registredWindows.push('#toolTip7');
                                    kpiExpert_PENDIENTES.DrawTooltipDetail_GenericFr2(kpiExpert_PENDIENTES.lastEntity,'Holding','cat_cliente_estado');$('#toolTip4').find('.content').find('#getdata').css('visibility','hidden')">Mostrar Detalle por CLiente</button>   </div>`);

                                    //HAce mas alto
                                    $("#toolTip4").css("height",(Number($("#toolTip4").css("height").replaceAll("px",""))+80)+"px");

                                    //Alinea elementos nuevos
                                    $("#toolTip4").find(".content").css("display","flex");
                                    $("#toolTip4").find(".content").css("align-items","center");
                                    $("#toolTip4").find(".content").css("flex-direction","column");


                    });
                }                

            }else{
                alert("Error al encontrar URL API Pendienetes por Estado");
                
            }

}

kpiExpert_PENDIENTES.DrawTooltipDetail_Dia=function(entity){    

    var maximo=0;

    var arr=d3.nest()
            .key(function(d) { 

                    if(d.fecha){
                            return d.fecha.getTime(); 
                    }else{                       
                            return 0;
                    }                        
    
            })
            .entries(entity.pendientes.allRecords);

    var fechas={};        

    for(var i=0; i < arr.length; i++ ){

        arr[i].Libre_Pendiente_Hoy=0;
        arr[i].Libre_Retrasado=0;
        arr[i].Total=0;
        arr[i].fecha=arr[i].values[0].fecha.getTime();

        fechas[arr[i].values[0].fecha.getDate()+"_"+arr[i].values[0].fecha.getDay()]=true;

        for(var j=0; j < arr[i].values.length; j++ ){

            arr[i].Libre_Retrasado+=Number(arr[i].values[j].Libre_Retrasado);
            arr[i].Libre_Pendiente_Hoy+=Number(arr[i].values[j].Libre_Pendiente_Hoy);
            arr[i].Total+=arr[i].Libre_Retrasado+arr[i].Libre_Pendiente_Hoy;

        }

        if(maximo < arr[i].Total){
            maximo=arr[i].Total;
        }

    }

    arr = arr.sort((a, b) => {                
        return b.fecha - a.fecha;                                    

    }); 



    arr=arr.reverse();

    var arrTemp=[];

    var dia=((1000*60)*60)*24;
   
    for(var i=0; i < arr.length; i++ ){

        arrTemp.push(arr[i]);
        
            var date_=new Date(arr[i].fecha);
            
            if(date_.getDay()==5){

                    var sabado=new Date(arr[i].fecha+dia);
                    
                    if(!fechas[sabado.getDate()+"_"+sabado.getDay()] ){
                    
                            arrTemp.push({
                                Libre_Pendiente_Hoy:0,
                                Libre_Retrasado:0,
                             
                                fecha:new Date(arr[i].fecha+dia+dia),
                                Total:0,
                                agregado:true,
                                key:arr[i].fecha+dia
                            });

                    }

            }

           
            if(date_.getDay()==6){
            
                    var domingo=new Date(arr[i].fecha+dia+dia );
                   
                    if(!fechas[domingo.getDate()+"_"+domingo.getDay()] ){
                       
                            arrTemp.push({
                                Libre_Pendiente_Hoy:0,
                                Libre_Retrasado:0,
                             
                                fecha:new Date(arr[i].fecha+dia+dia),
                                Total:0,
                                agregado:true,
                                key:arr[i].fecha+dia+dia
                            });

                    }
            }

    }

    arr=arrTemp; 
    var ancho=17;

    var svgTooltipWidth=arr.length*ancho;

    if(svgTooltipWidth < 320)
        svgTooltipWidth=320;

    var svgTooltipHeight=350;
    var tamanioFuente=ancho*.7;   

    var marginBottom=svgTooltipHeight*.28;


    $("#toolTip3").css("visibility","visible");  
    $("#toolTip3").css("inset","");      
    $("#toolTip3").css("right","1%");
    $("#toolTip3").css("top","50px");

    if(windowWidth > 1500 ){

        $("#toolTip3").css("top",80+"px");
        $("#toolTip3").css("left",windowWidth*.6+"px");
        
    } 

    // FORMATEA TOOL TIP :
    
    vix_tt_formatToolTip("#toolTip3","Pedidos Pendientes por Día de "+dataManager.getNameFromId(entity.key),svgTooltipWidth+30,svgTooltipHeight,dataManager.GetTooltipInfoData("toolTip3","Retrasados"));

    // Agrega un div con un elemento svg :

    var svgElement = `<img id="simbologia" src="images/simb FR libre.png" style="width:290px;position:absolute;float:left;right:7px;top:67px;"></img><svg id='svgTooltip3' style='pointer-events:none;'></svg>`;
    d3.select("#toolTip3").append("div").html(svgElement);

    d3.select("#svgTooltip3")                     
        .style("width", svgTooltipWidth+"px" )
        .style("height", svgTooltipHeight+"px" )
                    ;

    for(var i=0; i < arr.length; i++ ){   

        var altura=svgTooltipHeight*.5;
        if(maximo==0){
            var altura1=1;
            var altura2=1;
        }else{
            var altura1=GetValorRangos( arr[i].Libre_Pendiente_Hoy,1, maximo ,1,altura);
            var altura2=GetValorRangos( arr[i].Libre_Retrasado,1, maximo ,1,altura);
        }
       

       
        d3.select("#svgTooltip3").append("rect")		    		
                                    .attr("width",ancho*.8 )
                                    .attr("class","penDetail")
                                    .attr("x",(ancho*i)  )
                                    .attr("y", (svgTooltipHeight)-altura1-marginBottom  )
                                    .attr("height",altura1)
                                    .attr("fill","#00A8FF")
                                    .style("pointer-events","auto")
                                    .append('title')
                                    .text("Libre Pendiente Hoy: "+formatNumber(arr[i].Libre_Pendiente_Hoy));	

        d3.select("#svgTooltip3").append("rect")		    		
                                    .attr("width",ancho*.8 )
                                    .attr("class","penDetail")
                                    .attr("x",(ancho*i)  )
                                    .attr("y", (svgTooltipHeight)-altura1-altura2-marginBottom-2  )
                                    .attr("height",altura2)
                                    .attr("fill","#EAFF00")
                                    .style("pointer-events","auto")
                                    .append('title')
                                    .text("Libre Retrasado: "+formatNumber(arr[i].Libre_Retrasado));	
                                    ;
                
        d3.select("#svgTooltip3")
                .append("text")						
                .attr("class","penDetail")
                .style("fill",function(d){
                                    
                    var color ="#FFFFFF";

                    if(arr[i].agregado){
                        color ="#5C5C5C";
                    }
                    
                    return color;
                    
                })		
                .style("font-family","Cabin")
                .style("font-weight","bold")
                .style("font-size",tamanioFuente)	
                .style("text-anchor","start")
                .attr("transform"," translate("+String( (ancho*i)+tamanioFuente-2  )+","+String( (svgTooltipHeight)-altura1-altura2-marginBottom-9   )+")  rotate("+(-90)+") ")
                .text(function(){
                
                    return  formatNumber(arr[i].Total) ;

                });

        d3.select("#svgTooltip3")
                .append("text")						
                .attr("class","penDetail")
                .style("fill",function(d){
                                    
                    var color ="#FFFFFF";

                    if(arr[i].agregado){
                        color ="#5C5C5C";
                    }
                    
                    return color;
                    
                })		
                .style("font-family","Cabin")
                .style("font-weight","bold")
                .style("font-size",tamanioFuente)	
                .style("text-anchor","end")
                .attr("transform"," translate("+String( (ancho*i)+tamanioFuente-2  )+","+String( (svgTooltipHeight)-marginBottom+10   )+")  rotate("+(-90)+") ")
                .text(function(){
                
                    var date=new Date( Number(arr[i].key) );

                    return  date.getDate()+" "+getMes(date.getMonth());

                });
                
    }

}


kpiExpert_PENDIENTES.DrawTooltipDetail_Tipo=function(entity){    

    var maximo=0;

    var dataElement=entity.pendientes.values[0];

    var campos=["Entregado:","Libre_Retrasado","Libre_Pendiente_Hoy","Libre_Programado_Total","Total_Libre_Pendientes_siguientes_días","AutoEntrega y Recogido:","Libre_RecAutf",];
    var colores=["#00DEFF","#00DEFF","#00DEFF","#00DEFF","#00DEFF","#8BFF1A","#8BFF1A",];

    //Calcula total de pendientes entregados
    dataElement.Total_Libre_Pendientes_siguientes_días=0;
    for(var i=0; i < campos.length; i++ ){
        if(dataElement){
            if( dataElement[campos[i]] && (campos[i]=="Libre_Retrasado"  || campos[i]=="Libre_Pendiente_Hoy" || campos[i]=="Libre_Programado_Total") ){

                dataElement.Total_Libre_Pendientes_siguientes_días += Number(dataElement[campos[i]]);

            }
        }       
       
    }

    for(var i=0; i < campos.length; i++ ){
        if(dataElement){
            if(dataElement[campos[i]]){
                if(maximo < Number(dataElement[campos[i]]) ){
                    maximo = Number(dataElement[campos[i]]);
                } 
            }
        }       
       
    }

    var altura=20;
    var caso=0;

    var svgTooltipHeight=(campos.length*altura)+20;
    var svgTooltipWidth=500;
    var marginLeft=svgTooltipWidth*.45;
    var tamanioFuente=altura*.8;
    var marginTop=svgTooltipHeight*.05;

    $("#toolTip2").css("visibility","visible");            
    $("#toolTip2").css("top","400px");
    $("#toolTip2").css("right","1%");

    if(windowWidth > 1500 ){

        $("#toolTip2").css("left",windowWidth*.6+"px");
       
    } 

    vix_tt_formatToolTip("#toolTip2","Pedidos Pendientes por Tipo de "+dataManager.getNameFromId(entity.key)+" (TM)",svgTooltipWidth+10,svgTooltipHeight+40,dataManager.GetTooltipInfoData("toolTip2","Retrasados"));

    var svgElement = "<svg id='svgTooltip' style='pointer-events:none;'></svg>";
    d3.select("#toolTip2").append("div").html(svgElement);

    d3.select("#svgTooltip")                     
        .style("width", svgTooltipWidth )
        .style("height", svgTooltipHeight+"px" )
                    ;



    for(var i=0; i < campos.length; i++ ){

        if( !dataElement ){

            d3.select("#svgTooltip")
            .append("text")						
            .attr("class","penDetail")
            .style("fill",colores[caso])		
            .style("font-family","Cabin")
            .style("font-weight","bold")
            .style("font-size",tamanioFuente)						
            .style("text-anchor","start")
            .style("opacity",0 )
            .attr("transform"," translate("+String( 10  )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
            .text(function(){
            
                return "SIN DATA";
            })
            .transition().delay(0).duration(1000)
            .style("opacity",1 )
        ;

        }else if( !dataElement[campos[i]] ){

            d3.select("#svgTooltip")
                        .append("text")						
                        .attr("class","penDetail")
                        .style("fill",colores[caso])		
                        .style("font-family","Cabin")
                        .style("font-weight","bold")
                        .style("font-size",tamanioFuente)						
                        .style("text-anchor","start")
                        .style("opacity",0 )
                        .attr("transform"," translate("+String( 2  )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                        .text(function(){
                        
                            return campos[i];
                        })
                        .transition().delay(0).duration(1000)
                        .style("opacity",1 )
                    ;

        }else{


            var ancho=GetValorRangos(  Number(dataElement[campos[i]]) ,1, maximo ,1,svgTooltipWidth*.4);
        
            d3.select("#svgTooltip")
                        .append("text")						
                        .attr("class","penDetail")
                        .style("fill",colores[caso])		
                        .style("font-family","Cabin")
                        .style("font-weight","bold")
                        .style("font-size",tamanioFuente*.8)
                        .style("text-anchor","start")
                        .style("opacity",0 )
                        .attr("transform"," translate("+String( ancho+(marginLeft)+10  )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                        .text(function(){
            
                            return formatNumber((Math.round(   (Number(dataElement[campos[i]])))));
            })
            .transition().delay(0).duration(1000)
            .style("opacity",1 )
        ;                  
           
            d3.select("#svgTooltip").append("rect")		    		
                        .attr("width",1 )
                        .attr("class","penDetail")
                        .attr("x",marginLeft   )
                        .attr("y", (altura*caso)+marginTop+(altura*.4) )
                        .attr("height",altura*.4)                        
                        .attr("fill",colores[caso])
                        .transition().delay(0).duration(1000)
                        .attr("width",ancho )
                        ;

            

            d3.select("#svgTooltip")
                        .append("text")						
                        .attr("class","penDetail")
                        .style("fill",colores[caso])		
                        .style("font-family","Cabin")
                        .style("font-weight","bold")
                        .style("font-size",tamanioFuente*.8)						
                        .style("text-anchor","start")
                        .style("opacity",0 )
                        .attr("transform"," translate("+String( 10  )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                        .text(function(){
                        
                            return config.checkLabel(campos[i]);

                        })
                        .transition().delay(0).duration(1000)
                        .style("opacity",1 )
                    ;

          

        }
        caso++;

    }
}