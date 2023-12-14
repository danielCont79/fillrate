var kpiExpert_FR={};

kpiExpert_FR.DrawElement=function(entity,i){      
      
        var altura1=GetValorRangos(entity.fillRate.por1,1 ,100 ,1 ,entity.altura );
   
        var geometry1= viewer.entities.add({
                name : '',
                position: Cesium.Cartesian3.fromDegrees( entity.lng , entity.lat , (altura1/2)  ),
                cylinder : {
                    length : altura1,
                    topRadius : entity.radio*.9,
                    bottomRadius : entity.radio*.9,
                    material : Cesium.Color.fromCssColorString("#006CFF").withAlpha(1)              
                    
                }
        });


        mapElementsArr.push(geometry1);						

        var altura2=GetValorRangos(entity.fillRate.por2,1 ,100 ,1 ,entity.altura );

        var geometry2= viewer.entities.add({
                name : '',
                position: Cesium.Cartesian3.fromDegrees( entity.lng , entity.lat , (altura2/2)+altura1+(entity.altura*.02) ),
                cylinder : {
                    length : altura2,
                    topRadius : entity.radio*.9,
                    bottomRadius : entity.radio*.9,
                    material : Cesium.Color.fromCssColorString("#FFF117").withAlpha(1)              
                    
                }
        });


        mapElementsArr.push(geometry2);

        var altura3=GetValorRangos(entity.fillRate.por3,1 ,100 ,1 ,entity.altura );

        var geometry3= viewer.entities.add({
                name : '',
                position: Cesium.Cartesian3.fromDegrees( entity.lng , entity.lat , (altura3/2)+altura1+altura2+(entity.altura*.04)  ),
                cylinder : {
                    length : altura3,
                    topRadius : entity.radio*.9,
                    bottomRadius : entity.radio*.9,
                    material : Cesium.Color.fromCssColorString("#FF0018").withAlpha(1)              
                    
                }
        });

        mapElementsArr.push(geometry3);

        if(i < 300){

                //VASO EXTERIOR
                var geometryExt= viewer.entities.add({
                        name : '',
                        position: Cesium.Cartesian3.fromDegrees( entity.lng , entity.lat , (entity.altura/2)  ),
                        cylinder : {
                                length : entity.altura+(entity.altura*.04),
                                topRadius : entity.radio,
                                bottomRadius : entity.radio,
                                material : Cesium.Color.fromCssColorString("#ffffff").withAlpha(.2)              
                                
                        }
                        });
                
                entity.geometries=[geometry1,geometry2,geometry3,geometryExt];
                mapElementsArr.push(geometryExt);
                mapElements[geometryExt.id]=entity;

        }else{

                entity.geometries=[geometry1,geometry2,geometry3];

                if(altura1 > 100){              
                        mapElementsArr.push(geometry1);
                        mapElements[geometry1.id]=entity;
                }else if(altura2 > 100){
                        mapElementsArr.push(geometry2);
                        mapElements[geometry2.id]=entity;
                }else if(altura3 > 100){
                        mapElementsArr.push(geometry3);
                        mapElements[geometry3.id]=entity;
                }

        }  
        
        if(i < 500){

                entity.labelSVG=svgLines.append("text")                            
                        .attr("x",0 )
                        .attr("y", 0   )
                        .style("fill","#FFFFFF")
                        .attr("filter","url(#dropshadowText)")
                        .attr("class","entityLabel")                                    
                        .style("font-family","Cabin")
                        .style("text-anchor","middle")
                        .style("font-weight","normal")
                        .style("font-size",12)                                
                        .text( function(d){
                            
                        return entity.fillRate.por1+"%";
                        
                        });

        }

        if(Stage.labelsInterval)        
                clearInterval(Stage.labelsInterval);
       
        Stage.labelsInterval = setInterval(function(){ Stage.DrawFRLabels(); }, 50);
}

kpiExpert_FR.eraseChart=function(){ 

        d3.select("#svgTooltip").selectAll(".frDetail").data([]).exit().remove();
        d3.select("#svgTooltip3").selectAll(".frDetail").data([]).exit().remove();
        d3.select("#svgTooltip4").selectAll(".frDetail").data([]).exit().remove();

        $("#toolTip2").css("visibility","hidden");
        $("#toolTip3").css("visibility","hidden");
        $("#toolTip4").css("visibility","hidden");
        $("#toolTip5").css("visibility","hidden");
       
}

kpiExpert_FR.lastEntity;
kpiExpert_FR.DrawTooltipDetail=function(entity){  
        
        kpiExpert_FR.lastEntity=entity;

        d3.select("#svgTooltip").selectAll(".frDetail").data([]).exit().remove();
        d3.select("#svgTooltip3").selectAll(".frDetail").data([]).exit().remove();
        d3.select("#svgTooltip4").selectAll(".frDetail").data([]).exit().remove();

        $("#toolTip2").css("visibility","hidden");
        $("#toolTip3").css("visibility","hidden");
        $("#toolTip4").css("visibility","hidden");
        $("#toolTip5").css("visibility","hidden");

        kpiExpert_FR.registredWindows=[];

        kpiExpert_FR.DrawTooltipDetail_ByDay(entity);
        kpiExpert_FR.registredWindows.push("toolTip2");

        //DrawTooltipDetail_Estado
        //DrawTooltipDetail_UN

        //Ventanas segun nivel de lectura:
    
        if($("#nivel_cb").val() < 3){ // Nacional o regiones
                kpiExpert_FR.registredWindows.push("toolTip3");
                kpiExpert_FR.DrawTooltipDetail_Estado(entity);
        }
        
        if($("#nivel_cb").val() ==3 || $("#nivel_cb").val() ==4 ){ // estado o gerencia 
                kpiExpert_FR.registredWindows.push("#toolTip3");
                kpiExpert_FR.DrawTooltipDetail_UN(entity);
        }
        
        if($("#nivel_cb").val() == 3 ){// estado 
                //kpiExpert_FR.registredWindows.push("#toolTip6");
                //kpiExpert_FR.DrawTooltipDetail_GenericFr(entity,"Holding","cat_cliente_estado");
        }
        
        if($("#nivel_cb").val() == 5  ){//  UN 

                kpiExpert_FR.registredWindows.push("toolTip3");
                kpiExpert_FR.DrawTooltipDetail_Estado(entity);

                //kpiExpert_FR.registredWindows.push("#toolTip6");
                //kpiExpert_FR.DrawTooltipDetail_GenericFr(entity,"Holding","cat_cliente_estado");
        }
        
        if($("#nivel_cb").val() == 7 ){// ZT debe ver holding
                kpiExpert_FR.registredWindows.push("#toolTip6");
                kpiExpert_FR.DrawTooltipDetail_GenericFr(entity,"Holding","cat_cliente_estado");
        }
        
        if($("#nivel_cb").val() == 6 ){// Holding debe ver sucrusal
                kpiExpert_FR.registredWindows.push("#toolTip6");
                kpiExpert_FR.DrawTooltipDetail_GenericFr(entity,"Obra","cat_sucursal_estado");
        }
        
        if($("#nivel_cb").val() == 8 ){// Sucrusal-Obra debe ver frente
                kpiExpert_FR.registredWindows.push("#toolTip6");
                kpiExpert_FR.DrawTooltipDetail_GenericFr(entity,"Frente","cat_frente");
        }
        
        //********************************************************************** */   

        opacidadCesium=30;
        $("#cesiumContainer").css("opacity",opacidadCesium/100);

        vix_tt_distributeDivs(["#toolTip2","#toolTip3"]);              

}

kpiExpert_FR.registredWindows=[];
kpiExpert_FR.sortRegistredWindows=function(){

  vix_tt_distributeDivs(kpiExpert_FR.registredWindows);

}

kpiExpert_FR.DrawTooltipDetail_GenericFr=function(entity, agrupador ,catlog){  

        $("#cargando").css("visibility","visible");

        var serviceName;
        var apiURL;
        var agrupador=agrupador;
        
      
        for(var i=0; i < store.apiDataSources.length; i++){          
          if(store.apiDataSources[i].varName=="fillRate"){            
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
        
                              if(  6 == $("#nivel_cb").val()  &&  store.catlogsForFilters[j].storeProcedureField=="Cliente" ){ // Holding
                
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

                var URL=apiURL+"/"+serviceName+"?fechaInicio="+dateInit_+"&fechaFin="+dateEnd_+"&agrupador="+agrupador+""+params;
                console.log(URL);
        
                if(URL.indexOf("undefined" < 0)){
        
                dataLoader.AddLoadingTitle("FR por "+agrupador);
        
                    d3.json(URL, function (error, data) {
        
                                $("#cargando").css("visibility","hidden");

                                dataLoader.DeleteLoadingTitle("FR por "+agrupador); 

                                dataLoader.HideLoadings();

                                if(error){
                                        alert("Error API FR por "+agrupador,error);
                                     
                                        return;
                                }
                
                                if(data.error){
                                        alert("Error API FR por "+agrupador,data.error);
                                      
                                        return;
                                }
                
                                console.log("FR por "+agrupador,data.recordset);

                                var maximo1=0;
                                var maximo2=0;
                                var maximo=0;

                                var arrTemp=[];

                                var arr=d3.nest()
                                        .key(function(d) { return d.Agrupador; })
                                        .entries(data.recordset);

                                        var totalSolicitado=0;

                                for(var i=0; i < arr.length; i++ ){

                                        arr[i].CantEntfinal=0;                                       
                                        arr[i].totalSolicitado=0;
                                        arr[i].totalSolicitadoATiempo=0;

                                        arr[i].vol1=0;
                                        arr[i].vol2=0;
                                        arr[i].vol3=0;
                                        
                                        arr[i].por1=0;
                                        arr[i].por2=0;
                                        arr[i].por3=0;

                                        for(var j=0; j < arr[i].values.length; j++ ){

                                                arr[i].CantEntfinal+=Number(arr[i].values[j][campoDeVolumenFR]);
                                                arr[i].totalSolicitado+=Number(arr[i].values[j][campoTotalSolicitado]);                               
                                                totalSolicitado+=Number(arr[i].values[j][campoTotalSolicitado]);
                
                                                if(arr[i].values[j][campoDeATiempo] == "A Tiempo"){                                 
                                                        arr[i].vol1+=Number(arr[i].values[j][campoDeVolumenFR]);
                                                }else if(arr[i].values[j][campoDeATiempo] == "1 a 2 días Tarde"){
                                                        arr[i].vol2+=Number(arr[i].values[j][campoDeVolumenFR]);
                                                }else if(arr[i].values[j][campoDeATiempo] == "3 o más días Tarde"){
                                                        arr[i].vol3+=Number(arr[i].values[j][campoDeVolumenFR]);
                                                }                        
                                        }
                
                                        if(maximo < arr[i].CantEntfinal){
                                                maximo=arr[i].CantEntfinal;
                                        }

                                        arr[i].por1=Math.round((arr[i].vol1/arr[i].totalSolicitado)*100);
                                        arr[i].por2=Math.round((arr[i].vol2/arr[i].totalSolicitado)*100);
                                        arr[i].por3=Math.round((arr[i].vol3/arr[i].totalSolicitado)*100);
                                        
                                }

                                var sumapor=0;

                                for(var i=0; i < arr.length; i++ ){

                                        arr[i].porEntregado= arr[i].vol1/totalSolicitado;
                                        arr[i].porSolicitado= arr[i].totalSolicitado/totalSolicitado;
                                        arr[i].porDifEntrtegadoSolicitado=arr[i].porSolicitado-arr[i].porEntregado;
                                        sumapor+=arr[i].porDifEntrtegadoSolicitado;
                
                                        if(maximo2 < arr[i].porDifEntrtegadoSolicitado )
                                                maximo2 = arr[i].porDifEntrtegadoSolicitado;               
                
                                }
                                
                                arr = arr.sort((a, b) => {                
                                        return b.CantEntfinal - a.CantEntfinal;                                   
                                }); 
                
                                //arr=arr.reverse();

                                var altura=30;
                                var caso=0;
                        
                                var svgTooltipHeight=arr.length*altura;
                        
                                if(svgTooltipHeight<80)
                                svgTooltipHeight=80;

                                if(svgTooltipHeight > windowHeight*.7)
                                svgTooltipHeight = windowHeight*.7;
                        
                        
                        
                                var marginLeft=svgTooltipWidth*.2;
                                var tamanioFuente=altura*.4;
                                var marginTop=35;

                                $("#toolTip5").css("visibility","visible"); 
                                $("#toolTip5").css("inset","");   
                                $("#toolTip5").css("top",80+"px");
                                $("#toolTip5").css("right",1+"%");

                                if(svgTooltipHeight > 400){
                                        $("#toolTip5").css("top","");
                                        $("#toolTip5").css("bottom","10px");
                                }  

                                if(windowWidth > 1500 ){

                                        $("#toolTip5").css("top",80+"px");
                                        $("#toolTip5").css("left",windowWidth*.55+"px");
                                
                                }

                                // DATOS 

                                var data = arr.map(function(item) {
                                        return {
                                                key: item.key,
                                                "por1": item.por1,      
                                                "cant": item.CantEntfinal,
                                                "porRetrasado": item.porDifEntrtegadoSolicitado
                                        };
                                        }); 
                                
                               

                                var svgTooltipWidth=750;
                        
                                var columns = [
                                        { key: "key", header: agrupador, sortable: true, width: "200px" },
                                        { key: "por1", header: "Fill Rate", sortable: true, width: "180px" },    
                                        { key: "cant", header: "Volumen Entregado", sortable: true, width: "180px" },
                                        { key: "porRetrasado", header: "Impacto Sobre Total (%)", sortable: true, width: "180px" },
                                        ];
                        
                               

                                // DEFINE VISITORS PARA CADA COLUMNA   
        
                                var columnVisitors = {
                                        key: function(value,i) {

                                        var nombre=dataManager.getNameFromIdFromCatlog(value , catlog);

                                        if(nombre.length > 31)
                                                nombre=nombre.substr(0,31)+"...";

                                        return `<div class="key-selector" onclick="backInfoNav.push({entity:'${entity.key}' , catlog:'${dataManager.getCurrentCatlog()}'});filterControls.arrowUpdate();filterControls.lookForEntity('${value}','${catlog}','${entity.key}')">${nombre}

                                        </div>`;
                                        },    
                                        por1: function(value,i) {

                                        var p1 = arr[i].por1;  
                                        var p2 =  arr[i].por2;  
                                        var p3 =  arr[i].por3;  
                                        var svgWidth = 150;  
                                        var svgHeight = 15;               

                                        var svgString = createBar(p1, p2, p3, svgWidth, svgHeight, p1+"%");

                                        return '<div class="bar-container">' +svgString +'</div>';

                                        },        
                                        cant: function(value,i) {
                                                var ancho=GetValorRangos( arr[i].CantEntfinal,1, maximo ,1, 180 );
                                                var barValue = formatNumber(value);

                                                return '<div class="bar-container">' +
                                                '<span class="bar-value" style="width:80px">' + barValue + '</span>' +
                                                '<svg width="90%" height="10"><rect class="bar-rect" width="' + ancho + '" height="10" style="fill: white;"></rect></svg>' +
                                                '</div>';

                                                
                                        },
                                        porRetrasado: function(value,i) {
                                                var ancho=GetValorRangos( value*10000,1,maximo2*10000 ,1, 120 );

                                                if(ancho > 120)
                                                ancho=120
                                                
                                                return '<div class="bar-container">' +
                                                '<span class="bar-value" style="width:80px;padding-left:20px;">' + Math.round(value*10000)/100 + '</span>' +
                                                '<svg width="90%" height="10"><rect class="bar-rect" width="' + ancho + '" height="10" style="fill: white;"></rect></svg>' +
                                                '</div>';                
                                        }
                                };

                                // COLUMNAS CON TOTALES :

                                var columnsWithTotals = ['por1','cant','porRetrasado']; 
                                var totalsColumnVisitors = {
                                                'por1': function(value) { 
                                                        var v = ( entity.fillRate.fillRate)+"%";             
                                                        return v; 
                                                },
                                                'cant': function(value) { 
                                                        var v = formatNumber(value)+"TM";             
                                                        return v; 
                                                },
                                                'porRetrasado': function(value) { 
                                                        var v =  Math.round(value*10000)/100+"%";             
                                                        return v; 
                                                }
                                                };

                                
                                
                                // FORMATEA DIV :

                                vix_tt_formatToolTip("#toolTip5","Fill Rate por "+agrupador+" (TM)",svgTooltipWidth,svgTooltipHeight+100,dataManager.GetTooltipInfoData("toolTip5","FillRate"));

                                // CREA TABLA USANDO DATOS
                                
                                vix_tt_table_extended(data, columns, columnVisitors, totalsColumnVisitors, "toolTip5", columnsWithTotals );        

                                // Crea una barra inferior y pasa una funcion de exportacion de datos
                                vix_tt_formatBottomBar("#toolTip5", function () {
                                var dataToExport = formatDataForExport(data, columns);
                                var filename = "exported_data";
                                exportToExcel(dataToExport, filename);
                                });
                                
                                // APLICA TRANSICIONES 
                                
                                vix_tt_transitionRectWidth("toolTip5"); 

                                kpiExpert_FR.sortRegistredWindows();

                    });

                }

        }


}


kpiExpert_FR.DrawTooltipDetail_UN=function(entity,extraData){ 

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
      
            if(store.apiDataSources[i].varName=="frUN"){                    
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

                        if(  7 == $("#nivel_cb").val()  &&  store.catlogsForFilters[j].storeProcedureField=="ZonaTransporte" ){ // ZT
                                params+="&ZonaTransporte="+entity.key;
                                continue;
                        } 
     
                        if($("#"+store.catlogsForFilters[j].id).val() != "" && $("#"+store.catlogsForFilters[j].id).val() != undefined && $("#"+store.catlogsForFilters[j].id).val() != "Todos" ){
     
                                params+="&"+store.catlogsForFilters[j].storeProcedureField+"="+store.catlogsForFilters[j].diccNames[ $("#"+store.catlogsForFilters[j].id).val() ];
     
                        }
     
                }

                // Filtra en caso de haber seleccionado arañá de sacos o granel
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
                
                 //ID de entidad
                 params+="&idSpider="+entity.key;


                var URL=apiURL+"/"+serviceName+"?fechaInicio="+dateInit_+"&fechaFin="+dateEnd_+"&agrupador="+agrupador+params;
                console.log(URL);  

                if(URL.indexOf("undefined" < 0)){

                        dataLoader.AddLoadingTitle("FillRate de Unidades de Neg");

                        d3.json(URL, function (error, data) {

                                dataLoader.DeleteLoadingTitle("FillRate de Unidades de Neg"); 

                                dataLoader.HideLoadings();

                                $("#cargando").css("visibility","hidden");

                                if(error){
                                        alert("Error API FillRate UN",error);
                                       
                                        return;
                                }

                                if(data.error){
                                        alert("Error API FillRate UN",data.error);
                                      
                                        return;
                                }

                                console.log("FR de UN",data.recordset); 

                                var maximo1=0;
                                var maximo2=0;
                                var maximo=0;

                                var arrTemp=[];

                                var arr=d3.nest()
                                        .key(function(d) { return d.vc50_UN_Tact; })
                                        .entries(data.recordset); 

                                var totalSolicitado=0;

                                for(var i=0; i < arr.length; i++ ){

                                        arr[i].CantEntfinal=0;                                       
                                        arr[i].totalSolicitado=0;
                                        arr[i].totalSolicitadoATiempo=0;

                                        arr[i].vol1=0;
                                        arr[i].vol2=0;
                                        arr[i].vol3=0;
                                      
                                        arr[i].por1=0;
                                        arr[i].por2=0;
                                        arr[i].por3=0;

                                        for(var j=0; j < arr[i].values.length; j++ ){

                                                arr[i].CantEntfinal+=Number(arr[i].values[j][campoDeVolumenFR]);
                                                arr[i].totalSolicitado+=Number(arr[i].values[j][campoTotalSolicitado]);                               
                                                totalSolicitado+=Number(arr[i].values[j][campoTotalSolicitado]);
                
                                                if(arr[i].values[j][campoDeATiempo] == "A Tiempo"){                                 
                                                        arr[i].vol1+=Number(arr[i].values[j][campoDeVolumenFR]);
                                                }else if(arr[i].values[j][campoDeATiempo] == "1 a 2 días Tarde"){
                                                        arr[i].vol2+=Number(arr[i].values[j][campoDeVolumenFR]);
                                                }else if(arr[i].values[j][campoDeATiempo] == "3 o más días Tarde"){
                                                        arr[i].vol3+=Number(arr[i].values[j][campoDeVolumenFR]);
                                                }                        
                                        }
                
                                        if(maximo < arr[i].CantEntfinal){
                                                maximo=arr[i].CantEntfinal;
                                        }

                                        arr[i].por1=Math.round((arr[i].vol1/arr[i].totalSolicitado)*100);
                                        arr[i].por2=Math.round((arr[i].vol2/arr[i].totalSolicitado)*100);
                                        arr[i].por3=Math.round((arr[i].vol3/arr[i].totalSolicitado)*100);
                                        
                                }

                                var sumapor=0;

                                for(var i=0; i < arr.length; i++ ){

                                        arr[i].porEntregado= arr[i].vol1/totalSolicitado;
                                        arr[i].porSolicitado= arr[i].totalSolicitado/totalSolicitado;
                                        arr[i].porDifEntrtegadoSolicitado=arr[i].porSolicitado-arr[i].porEntregado;
                                        sumapor+=arr[i].porDifEntrtegadoSolicitado;
                
                                        if(maximo2 < arr[i].porDifEntrtegadoSolicitado )
                                                maximo2 = arr[i].porDifEntrtegadoSolicitado;               
                
                                }
                                
                                arr = arr.sort((a, b) => {                
                                        return b.CantEntfinal - a.CantEntfinal;                                   
                                }); 
                
                                //arr=arr.reverse();

                                var altura=30;
                                var caso=0;
                        
                                var svgTooltipHeight=arr.length*altura;
                        
                                if(svgTooltipHeight<80)
                                svgTooltipHeight=80;

                                if(svgTooltipHeight > windowHeight*.7)
                                svgTooltipHeight = windowHeight*.7;
                        
                        
                        
                                var marginLeft=svgTooltipWidth*.2;
                                var tamanioFuente=altura*.4;
                                var marginTop=35;

                                $("#toolTip4").css("visibility","visible"); 
                                $("#toolTip4").css("inset","");   
                                $("#toolTip4").css("top",80+"px");
                                $("#toolTip4").css("right",1+"%");

                                if(svgTooltipHeight > 400){
                                        $("#toolTip4").css("top","");
                                        $("#toolTip4").css("bottom","10px");
                                }  

                                if(windowWidth > 1500 ){

                                        $("#toolTip4").css("top",80+"px");
                                        $("#toolTip4").css("left",windowWidth*.55+"px");
                                
                                }

                                // DATOS 

                                var data = arr.map(function(item) {
                                        return {
                                                key: item.key,
                                                "por1": item.por1,      
                                                "cant": item.CantEntfinal,
                                                "porRetrasado": item.porDifEntrtegadoSolicitado
                                        };
                                        }); 
                                
                                if(extraData){

                                        var svgTooltipWidth=650;
                                
                                        var columns = [
                                                { key: "key", header: "Estado", sortable: true, width: "100px" },
                                                { key: "por1", header: "Fill Rate", sortable: true, width: "180px" },    
                                                { key: "cant", header: "Volumen Entregado", sortable: true, width: "180px" },
                                                { key: "porRetrasado", header: "Impacto Sobre Total (%)", sortable: true, width: "180px" },
                                                ];
                        
                                }else{
                        
                                        var svgTooltipWidth=450;
                                        
                                        var columns = [
                                                { key: "key", header: "Unidad Neg.", sortable: true, width: "100px" },
                                                { key: "por1", header: "Fill Rate", sortable: true, width: "180px" },    
                                                { key: "cant", header: "Volumen Entregado", sortable: true, width: "180px" }
                                                
                                                ];
                        
                                }

                                // DEFINE VISITORS PARA CADA COLUMNA   
        
                                var columnVisitors = {
                                        key: function(value,i) {

                                        return `<div class="key-selector" onclick="backInfoNav.push({entity:'${entity.key}' , catlog:'${dataManager.getCurrentCatlog()}'});filterControls.arrowUpdate();filterControls.lookForEntity('${value}','cat_un','${entity.key}')">${value}

                                        </div>`;
                                        },    
                                        por1: function(value,i) {

                                        var p1 = arr[i].por1;  
                                        var p2 =  arr[i].por2;  
                                        var p3 =  arr[i].por3;  
                                        var svgWidth = 150;  
                                        var svgHeight = 15;               

                                        var svgString = createBar(p1, p2, p3, svgWidth, svgHeight, p1+"%");

                                        return '<div class="bar-container">' +svgString +'</div>';

                                        },        
                                        cant: function(value,i) {
                                                var ancho=GetValorRangos( arr[i].CantEntfinal,1, maximo ,1, 180 );
                                                var barValue = formatNumber(value);

                                                return '<div class="bar-container">' +
                                                '<span class="bar-value" style="width:80px">' + barValue + '</span>' +
                                                '<svg width="90%" height="10"><rect class="bar-rect" width="' + ancho + '" height="10" style="fill: white;"></rect></svg>' +
                                                '</div>';

                                                
                                        },
                                        porRetrasado: function(value,i) {
                                                var ancho=GetValorRangos( value*10000,1,maximo2*10000 ,1, 120 );

                                                if(ancho > 120)
                                                ancho=120
                                                
                                                return '<div class="bar-container">' +
                                                '<span class="bar-value" style="width:80px;padding-left:20px;">' + Math.round(value*10000)/100 + '</span>' +
                                                '<svg width="90%" height="10"><rect class="bar-rect" width="' + ancho + '" height="10" style="fill: white;"></rect></svg>' +
                                                '</div>';                
                                        }
                                };

                                // COLUMNAS CON TOTALES :

                                var columnsWithTotals = ['por1','cant','porRetrasado']; 
                                var totalsColumnVisitors = {
                                                'por1': function(value) { 
                                                        var v = ( entity.fillRate.fillRate)+"%";             
                                                        return v; 
                                                },
                                                'cant': function(value) { 
                                                        var v = formatNumber(value)+"TM";             
                                                        return v; 
                                                },
                                                'porRetrasado': function(value) { 
                                                        var v =  Math.round(value*10000)/100+"%";             
                                                        return v; 
                                                }
                                                };

                                
                                
                                // FORMATEA DIV :

                                vix_tt_formatToolTip("#toolTip4","Fill Rate por Unidad de Negocio (TM)",svgTooltipWidth,svgTooltipHeight+100,dataManager.GetTooltipInfoData("toolTip4","FillRate"),"kpiExpert_FR.DrawTooltipDetail_UN(kpiExpert_FR.lastEntity,true)");

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

                                kpiExpert_FR.sortRegistredWindows();

                                 //Agrega boton para abrir detalle por Cliente
                                 $("#toolTip4").find(".content").css("align-items","");
                                 $("#toolTip4").find(".content").append(`<div class="item2 loginContainer login-page form " style="background-color: rgba(0,0,0,0);position:relative;margin:0px;left: 0px;padding:3px;z-index:9999;visibility:visible;"><button id="getdata" style="margin:10px;width:90%" class="loginBtn" onclick="kpiExpert_FR.registredWindows.push('#toolTip5');
                                 kpiExpert_FR.DrawTooltipDetail_GenericFr(kpiExpert_FR.lastEntity,'Holding','cat_cliente_estado');$('#toolTip4').find('.content').find('#getdata').css('visibility','hidden')">Mostrar Detalle por CLiente</button>   </div>`);
 
                                 //HAce mas alto
                                 $("#toolTip4").css("height",(Number($("#toolTip4").css("height").replaceAll("px",""))+80)+"px");
 
                                 //Alinea elementos nuevos
                                 $("#toolTip4").find(".content").css("display","flex");
                                 $("#toolTip4").find(".content").css("align-items","center");
                                 $("#toolTip4").find(".content").css("flex-direction","column");

                        });

                }

        }

}    

kpiExpert_FR.DrawTooltipDetail_Estado=function(entity,extraData){ 

                var maximo=0;
                var maximo2=0;

                var arr=d3.nest()
                .key(function(d) { return d.EstadoZTDem; })
                .entries(entity.values);  

               
                var totalSolicitado=0;

                for(var i=0; i < arr.length; i++ ){
                        
                        arr[i].CantEntfinal=0;
                        arr[i].fecha=arr[i].values[0].fecha.getTime();
                        arr[i].totalSolicitado=0;
                        arr[i].totalSolicitadoATiempo=0;                        

                        arr[i].vol1=0;
                        arr[i].vol2=0;
                        arr[i].vol3=0;
                      
                        arr[i].por1=0;
                        arr[i].por2=0;
                        arr[i].por3=0;

                        for(var j=0; j < arr[i].values.length; j++ ){

                                arr[i].CantEntfinal+=Number(arr[i].values[j][campoDeVolumenFR]);
                                arr[i].totalSolicitado+=Number(arr[i].values[j][campoTotalSolicitado]);                               
                                totalSolicitado+=Number(arr[i].values[j][campoTotalSolicitado]);

                                if(arr[i].values[j][campoDeATiempo] == "A Tiempo"){                                 
                                        arr[i].vol1+=Number(arr[i].values[j][campoDeVolumenFR]);
                                }else if(arr[i].values[j][campoDeATiempo] == "1 a 2 días Tarde"){
                                        arr[i].vol2+=Number(arr[i].values[j][campoDeVolumenFR]);
                                }else if(arr[i].values[j][campoDeATiempo] == "3 o más días Tarde"){
                                        arr[i].vol3+=Number(arr[i].values[j][campoDeVolumenFR]);
                                }                        
                        }

                        if(maximo < arr[i].CantEntfinal){
                                maximo=arr[i].CantEntfinal;
                        } 
                        
                        arr[i].por1=Math.round((arr[i].vol1/arr[i].totalSolicitado)*100);
                        arr[i].por2=Math.round((arr[i].vol2/arr[i].totalSolicitado)*100);
                        arr[i].por3=Math.round((arr[i].vol3/arr[i].totalSolicitado)*100);            

                }

                var sumapor=0;

                for(var i=0; i < arr.length; i++ ){

                        arr[i].porEntregado= arr[i].vol1/totalSolicitado;
                        arr[i].porSolicitado= arr[i].totalSolicitado/totalSolicitado;
                        arr[i].porDifEntrtegadoSolicitado=arr[i].porSolicitado-arr[i].porEntregado;
                        sumapor+=arr[i].porDifEntrtegadoSolicitado;

                        if(maximo2 < arr[i].porDifEntrtegadoSolicitado )
                                maximo2 = arr[i].porDifEntrtegadoSolicitado;

                        console.log("Entidad: ",arr[i].key);
                        console.log("entregado",arr[i].vol1);
                        console.log("solicitado",arr[i].totalSolicitado);
                        console.log("totalSolicitado",totalSolicitado);
                        console.log("% porEntregado",arr[i].porEntregado*100);
                        console.log("% porSolicitado",arr[i].porSolicitado*100);
                        console.log("% FR ",arr[i].por1);
                        console.log("dif",arr[i].porDifEntrtegadoSolicitado*100);
                        console.log("****************");

                }

                console.log("sumapor",sumapor*100);

                arr = arr.sort((a, b) => {                
                        return b.CantEntfinal - a.CantEntfinal;                                    

                }); 

                arr=arr.reverse();

                var altura=30;
                var caso=0;
        
                var svgTooltipHeight=arr.length*altura;
        
                if(svgTooltipHeight<80)
                svgTooltipHeight=80;

                if(svgTooltipHeight > windowHeight*.7)
                svgTooltipHeight = windowHeight*.7;
        
        
               
                var marginLeft=svgTooltipWidth*.2;
                var tamanioFuente=altura*.4;
                var marginTop=35;

                $("#toolTip3").css("visibility","visible"); 
                $("#toolTip3").css("inset","");   
                $("#toolTip3").css("top",80+"px");
                $("#toolTip3").css("right",1+"%");

                if(svgTooltipHeight > 400){
                        $("#toolTip3").css("top","");
                        $("#toolTip3").css("bottom","10px");
                }  

                if(windowWidth > 1500 ){

                        $("#toolTip3").css("top",80+"px");
                        $("#toolTip3").css("left",windowWidth*.55+"px");
                
                }    


        // DATOS 

        var data = arr.map(function(item) {
                return {
                        key: item.key,
                        "por1": item.por1,      
                        "cant": item.CantEntfinal,
                        "porRetrasado": item.porDifEntrtegadoSolicitado
                };
                });    
        
                // DEFINE COLUMNAS     

        if(extraData){

                var svgTooltipWidth=650;
        
                var columns = [
                        { key: "key", header: "Estado", sortable: true, width: "100px" },
                        { key: "por1", header: "Fill Rate", sortable: true, width: "180px" },    
                        { key: "cant", header: "Volumen Entregado", sortable: true, width: "180px" },
                        { key: "porRetrasado", header: "Impacto Sobre Total (%)", sortable: true, width: "180px" },
                        ];

        }else{

                var svgTooltipWidth=450;
                
                var columns = [
                        { key: "key", header: "Estado", sortable: true, width: "100px" },
                        { key: "por1", header: "Fill Rate", sortable: true, width: "180px" },    
                        { key: "cant", header: "Volumen Entregado", sortable: true, width: "180px" }
                       
                        ];

        }
        
        
        // DEFINE VISITORS PARA CADA COLUMNA    
        
        var columnVisitors = {
                key: function(value,i) {

                return `<div class="key-selector" onclick="backInfoNav.push({entity:'${entity.key}' , catlog:'${dataManager.getCurrentCatlog()}'});filterControls.arrowUpdate();filterControls.lookForEntity('${value}','cat_estado','${entity.key}')">${value}
                </div>`;
                },    
                por1: function(value,i) {

                var p1 = arr[i].por1;  
                var p2 =  arr[i].por2;  
                var p3 =  arr[i].por3;  
                var svgWidth = 150;  
                var svgHeight = 15;               

                var svgString = createBar(p1, p2, p3, svgWidth, svgHeight, p1+"%");

                return '<div class="bar-container">' +svgString +'</div>';

                },        
                cant: function(value,i) {
                        var ancho=GetValorRangos( arr[i].CantEntfinal,1, maximo ,1, 180 );
                        var barValue = formatNumber(value);

                        return '<div class="bar-container">' +
                        '<span class="bar-value" style="width:80px">' + barValue + '</span>' +
                        '<svg width="90%" height="10"><rect class="bar-rect" width="' + ancho + '" height="10" style="fill: white;"></rect></svg>' +
                        '</div>';

                        
                },
                porRetrasado: function(value,i) {
                        var ancho=GetValorRangos( value*10000,1,maximo2*10000 ,1, 120 );

                        if(ancho > 120)
                        ancho=120
                        
                        return '<div class="bar-container">' +
                        '<span class="bar-value" style="width:80px;padding-left:20px;">' + Math.round(value*10000)/100 + '</span>' +
                        '<svg width="90%" height="10"><rect class="bar-rect" width="' + ancho + '" height="10" style="fill: white;"></rect></svg>' +
                        '</div>';                
                }
        };

        // COLUMNAS CON TOTALES :

        var columnsWithTotals = ['por1','cant','porRetrasado']; 
        var totalsColumnVisitors = {
                        'por1': function(value) { 
                                var v = ( entity.fillRate.fillRate)+"%";             
                                return v; 
                        },
                        'cant': function(value) { 
                                var v = formatNumber(value)+"TM";             
                                return v; 
                        },
                        'porRetrasado': function(value) { 
                                var v =  Math.round(value*10000)/100+"%";             
                                return v; 
                        }
                        };

        
        
        // FORMATEA DIV :

        vix_tt_formatToolTip("#toolTip3","Fill Rate por Estado (TM)",svgTooltipWidth,svgTooltipHeight+100,dataManager.GetTooltipInfoData("toolTip3","FillRate"),"kpiExpert_FR.DrawTooltipDetail_Estado(kpiExpert_FR.lastEntity,true)");

        // CREA TABLA USANDO DATOS
        
        vix_tt_table_extended(data, columns, columnVisitors, totalsColumnVisitors, "toolTip3", columnsWithTotals );        

        // Crea una barra inferior y pasa una funcion de exportacion de datos
        vix_tt_formatBottomBar("#toolTip3", function () {
        var dataToExport = formatDataForExport(data, columns);
        var filename = "exported_data";
        exportToExcel(dataToExport, filename);
        });
        
        // APLICA TRANSICIONES         
        vix_tt_transitionRectWidth("toolTip3");

         //Agrega boton para abrir detalle por Cliente
         $("#toolTip3").find(".content").css("align-items","");
         $("#toolTip3").find(".content").append(`<div class="item2 loginContainer login-page form " style="background-color: rgba(0,0,0,0);position:relative;margin:0px;left: 0px;padding:3px;z-index:9999;visibility:visible;"><button id="getdata" style="margin:10px;width:90%" class="loginBtn" onclick="kpiExpert_FR.registredWindows.push('#toolTip5');
         kpiExpert_FR.DrawTooltipDetail_GenericFr(kpiExpert_FR.lastEntity,'Holding','cat_cliente_estado');$('#toolTip3').find('.content').find('#getdata').css('visibility','hidden')">Mostrar Detalle por CLiente</button>   </div>`);

         //HAce mas alto
         $("#toolTip3").css("height",(Number($("#toolTip3").css("height").replaceAll("px",""))+80)+"px");

         //Alinea elementos nuevos
         $("#toolTip3").find(".content").css("display","flex");
         $("#toolTip3").find(".content").css("align-items","center");
         $("#toolTip3").find(".content").css("flex-direction","column");
        
        

}               



kpiExpert_FR.DrawTooltipDetail_ByDay=function(entity){    
        
                var maximo=0;                             
                
                var diasDelPeriodo={};
                var data=[];
                for(var i=0; i < entity.values.length; i++ ){

                        if(entity.values[i].fecha){
                                
                                diasDelPeriodo[ entity.values[i].fecha.getTime() ]=true;
                                data.push(entity.values[i]);
                        }else{
                                
                        }

                }

                var dia=((1000*60)*60)*24;
                var init=dateInit.getTime();
                var end=dateEnd.getTime();
  
                for(var i=init; i < end+1000; i+=((1000*60)*60)*24 ){
                        
                        if(!diasDelPeriodo[new Date(i).getTime()]){
                                console.log("crea ",new Date(i).getTime(),new Date(i).getDate());
                                var obj={};
                                obj[campoDeVolumenFR]=0;
                                obj[campoTotalSolicitado]=0;
                                obj[campoDeATiempo]="A Tiempo";
                                obj.fecha=new Date(i);
                                data.push(obj);
                        }

                }
                

                var arr=d3.nest()
                        .key(function(d) { 

                                if(d.fecha){
                                        return d.fecha.getTime(); 
                                }else{                       
                                        return 0;
                                }                        
                
                        })
                        .entries(data);             

                for(var i=0; i < arr.length; i++ ){

                                arr[i].CantEntfinal=0;
                                arr[i].fecha=arr[i].values[0].fecha.getTime();
                                arr[i].totalSolicitado=0;

                                arr[i].vol1=0;
                                arr[i].vol2=0;
                                arr[i].vol3=0;

                                arr[i].por1=0;
                                arr[i].por2=0;
                                arr[i].por3=0;

                                for(var j=0; j < arr[i].values.length; j++ ){

                                        arr[i].CantEntfinal+=Number(arr[i].values[j][campoDeVolumenFR]);
                                        arr[i].totalSolicitado+=Number(arr[i].values[j][campoTotalSolicitado]);

                                        if(arr[i].values[j][campoDeATiempo] == "A Tiempo"){
                                                arr[i].vol1+=Number(arr[i].values[j][campoDeVolumenFR]);
                                                
                                        }else if(arr[i].values[j][campoDeATiempo] == "1 a 2 días Tarde"){
                                                arr[i].vol2+=Number(arr[i].values[j][campoDeVolumenFR]);
                                               
                                        }else if(arr[i].values[j][campoDeATiempo] == "3 o más días Tarde"){
                                                arr[i].vol3+=Number(arr[i].values[j][campoDeVolumenFR]);
                                        } 
                                        
                                }

                                
                                if(maximo < arr[i].CantEntfinal && arr[i].CantEntfinal>0 ){
                                        maximo=arr[i].CantEntfinal;
                                } 

                                if(arr[i].totalSolicitado > 0){
                                        arr[i].por1=Math.round((arr[i].vol1/arr[i].totalSolicitado)*100);
                                        arr[i].por2=Math.round((arr[i].vol2/arr[i].totalSolicitado)*100);
                                        arr[i].por3=Math.round((arr[i].vol3/arr[i].totalSolicitado)*100); 
                                }
                                          

                }               

                arr = arr.sort((a, b) => {                
                                return b.fecha - a.fecha;                                    
                
                });        
                
                arr=arr.reverse();

                var ancho=18;
                var caso=0;       
                
                var svgTooltipWidth=arr.length*(ancho*1.05) ;
                if(svgTooltipWidth < 280)
                        svgTooltipWidth=280;
        
                var svgTooltipHeight=600;                

                var marginBottom=svgTooltipHeight*.11;
                var tamanioFuente=ancho*.8;   
        
                $("#toolTip2").css("visibility","visible");        
                $("#toolTip2").css("max-height","");    
                $("#toolTip2").css("bottom",4+"px");
                $("#toolTip2").css("left",radio+"px");

                if(windowWidth > 1500 ){

                        $("#toolTip2").css("top",80+"px");
                        $("#toolTip2").css("left",radio+"px");
                       
                }  
                
                vix_tt_formatToolTip("#toolTip2","Cantidad entregada por Día de Fill Rate de "+dataManager.getNameFromId(entity.key)+" (TM)",svgTooltipWidth+7,svgTooltipHeight*.95,dataManager.GetTooltipInfoData("toolTip2","FillRate"));
                
                var svgElement = "<svg id='svgTooltip' style='pointer-events:none;'></svg>";

                d3.select("#toolTip2").append("div").html(svgElement);               

                // Continua con la Generacion de las graficas dentro del svgTooltip
        
                d3.select("#svgTooltip")                     
                        .style("width", svgTooltipWidth )
                        .style("height", svgTooltipHeight )
                        ;
        
                for(var i=0; i < arr.length; i++ ){        
                        
                        var altura=svgTooltipHeight*.18;
                        var altura1=GetValorRangos( arr[i].por1,1, 100 ,1,altura);
                        var altura2=GetValorRangos( arr[i].por2,1, 100 ,1,altura);
                        var altura3=GetValorRangos( arr[i].por3,1, 100 ,1,altura);
                
                
                        d3.select("#svgTooltip").append("rect")		    		
                                                .attr("width",ancho )
                                                .attr("class","frDetail")
                                                .attr("x",ancho*caso  )
                                                .attr("y", (svgTooltipHeight*.74)-altura-3-marginBottom  )
                                                .attr("height",1)
                                                .attr("fill","none")
                                                .style("stroke-width",1)
                                                .style("stroke-color","#ffffff")
                                                .transition().delay(0).duration(i*50)
                                                .style("height",altura )	
                                                ;

                        d3.select("#svgTooltip").append("rect")		    		
                                                .attr("width",ancho*.6 )
                                                .attr("class","frDetail")
                                                .attr("x",(ancho*caso)+(ancho*.1)  )
                                                .attr("y", (svgTooltipHeight*.74)-altura1-3-marginBottom  )
                                                .attr("height",1)
                                                .attr("fill","#00A8FF")
                                                .transition().delay(0).duration(i*50)
                                                .style("height",altura1 )	
                                                ;

                        d3.select("#svgTooltip").append("rect")		    		
                                                .attr("width",ancho*.6 )
                                                .attr("class","frDetail")
                                                .attr("x",(ancho*caso)+(ancho*.1)  )
                                                .attr("y", (svgTooltipHeight*.74)-altura1-altura2-3-marginBottom  )
                                                .attr("height",1)
                                                .attr("fill","#EAFF00")
                                                .transition().delay(0).duration(i*50)
                                                .style("height",altura2 )	
                                                ;

                        d3.select("#svgTooltip").append("rect")		    		
                                                .attr("width",ancho*.6 )
                                                .attr("class","frDetail")
                                                .attr("x",(ancho*caso)+(ancho*.1)  )
                                                .attr("y", (svgTooltipHeight*.74)-altura1-altura2-altura3-3-marginBottom  )
                                                .attr("height",1)
                                                .attr("fill","#FF0000")
                                                .transition().delay(0).duration(i*50)
                                                .style("height",altura3 )	
                                                ;

                        if(maximo > 1){
                            
                                var alturaVolumen=GetValorRangos( arr[i].CantEntfinal,1, maximo ,0,svgTooltipHeight*.18);
                        } else{
                                var alturaVolumen=1;    
                        }
                       

                        d3.select("#svgTooltip").append("rect")		    		
                                                .attr("width",(ancho*.7) )
                                                .attr("class","frDetail")
                                                .attr("x", ancho*caso  )
                                                .attr("y", (svgTooltipHeight*.35)-alturaVolumen-3  )
                                                .attr("height",alturaVolumen)
                                                .attr("fill","#FFFFFF")                                     
                                                .transition().delay(0).duration(i*50)
                                                .style("height",alturaVolumen )	
                                                ;

                        d3.select("#svgTooltip").append("circle")
                                                .attr("class","frDetail")
                                                .attr("fill","#ffffff")
                                                .attr("cx",(ancho*caso)+(ancho/2)-2 )
                                                .attr("cy",(svgTooltipHeight*.74)-3-marginBottom-alturaVolumen)                   
                                                .attr("r",4);
                
        
                        d3.select("#svgTooltip")
                                .append("text")						
                                .attr("class","frDetail")
                                .style("fill","#ffffff")		
                                .style("font-family","Cabin")
                                .style("font-weight","bold")
                                .style("font-size",tamanioFuente*.8)						
                                .style("text-anchor","start")
                                .style("opacity",0 )
                                .attr("transform"," translate("+String( ancho*caso+(tamanioFuente*.7)+1  )+","+String( ((svgTooltipHeight*.35))-alturaVolumen-6  )+")  rotate("+(-90)+") ")
                                .text(function(){
                                
                                if(arr[i].CantEntfinal==0)
                                return "";

                                return  formatNumber(arr[i].CantEntfinal);
        
                                })
                                .transition().delay(0).duration(i*50)
                                                .style("opacity",1 )
                        ;

                        d3.select("#svgTooltip")
                        .append("text")						
                        .attr("class","frDetail")
                        .style("fill","#FFFFFF")		
                        .style("font-family","Cabin")
                        .style("font-weight","bold")
                        .style("font-size",tamanioFuente*.84)						
                        .style("text-anchor","start")
                        .style("opacity",0 )
                        
                        .attr("transform"," translate("+String( ancho*caso+(tamanioFuente*.8)+1  )+","+String( (svgTooltipHeight*.74)-marginBottom+40 )+")  rotate("+(-90)+") ")
                        .text(function(){
                        
                                return  arr[i].por1+"%";
        
                        })
                        .transition().delay(0).duration(i*50)
                                                .style("opacity",1 )
                        ;
        
                        d3.select("#svgTooltip")
                                        .append("text")						
                                        .attr("class","frDetail")
                                        .style("fill","#ffffff")		
                                        .style("font-family","Cabin")
                                        .style("font-weight","bold")
                                        .style("font-size",tamanioFuente*.7)	
                                        .style("text-anchor","end")
                                        .attr("transform"," translate("+String( ancho*caso+(tamanioFuente*.7)  )+","+String( (svgTooltipHeight*.84)-marginBottom  )+")  rotate("+(-90)+") ")
                                        .text(function(){
                                                
                                        var date=new Date( Number(arr[i].key) );

                                        return  date.getDate()+" "+getMes(date.getMonth());
                
                                        });

                        
        
                                caso++;            
                }   
                
                //TITULOS
                d3.select("#svgTooltip")
                        .append("text")						
                        .attr("class","frDetail")
                        .style("fill","#ffffff")		
                        .style("font-family","Cabin")
                        .style("font-weight","normal")
                        .style("font-size",tamanioFuente)	
                        .style("text-anchor","start")
                        .attr("transform"," translate("+String( 3  )+","+String( 25 )+")  rotate("+(0)+") ")
                        .text("Cantidad Entregada Final:"); 

                d3.select("#svgTooltip")
                        .append("text")						
                        .attr("class","frDetail")
                        .style("fill","#ffffff")		
                        .style("font-family","Cabin")
                        .style("font-weight","normal")
                        .style("font-size",tamanioFuente)	
                        .style("text-anchor","start")
                        .attr("transform"," translate("+String( 3  )+","+String( svgTooltipHeight*.42  )+")  rotate("+(0)+") ")
                        .text("Fill Rate y Tiempos:");

                $("#toolTip2").css("max-height","");                      
     
    }




    kpiExpert_FR.DrawMainHeader=function(){

                kpiExpert_FR.ancho=windowWidth*.52;

                kpiExpert_FR.offSetLeft=168;
                kpiExpert_FR.offSetLeft2=350;
                kpiExpert_FR.offSetTop=46;              

                kpiExpert_FR.altura=35;

                var ancho=kpiExpert_FR.ancho;
                var offSetLeft=kpiExpert_FR.offSetLeft;
                var offSetTop=kpiExpert_FR.offSetTop;
              
                var altura=kpiExpert_FR.altura;
                
                svgLines.selectAll(".encabezado").data([]).exit().remove();

                if(store.map_var!=kpiExpert_FR){
                        return;
                }

                // SOLICITADO **********

                svgLines														
			.append("rect")
			.attr("fill","none")
			.style("stroke","#cccccc")
			.attr("filter","url(#glow)")
                        .attr("class","encabezado")
			.style("stroke-width",1)
			.style("stroke-opacity",.7)
			.style("opacity",.6 )
                        .attr("rx",5)
			.attr("width",ancho )
			.attr("height",altura )
			.attr("x",offSetLeft)
			.attr("y",offSetTop)
			;

                svgLines														
			.append("rect")
			.attr("fill","#000000")
			.style("stroke","#cccccc")			
                        .attr("class","encabezado")
			.style("stroke-width",1)
			.style("stroke-opacity",.5)
			.style("opacity",.6 )
                        .attr("rx",5)
			.attr("width",ancho-355 )
			.attr("height",altura-10 )
			.attr("x",offSetLeft+kpiExpert_FR.offSetLeft2)
			.attr("y",offSetTop+5)
			;

               

                svgLines.append("text")							
			//.attr("x",20 )
			//.attr("y", (alturaPorPeriodo*i)+margenSuperior+30  )
			.style("fill","white")		
                        .attr("class","encabezado")					
			.style("opacity",0)
			.style("font-family","Cabin")
			.style("font-weight","normal")
			.style("font-size",13*escalaTextos)						
			.style("text-anchor","start")
			.attr("x",offSetLeft+10)
			.attr("y", offSetTop+20 )
			.text(function(){

				return "Nacional Entregado: "+formatNumber((totalCanEnt_ref/totalCanSol_ref)*100)+"%, "+formatNumber((totalCanEnt_ref/1000) )+" K TM  ";

			})
                        .transition().delay(0).duration(1000)
                        .style("opacity",1 );



                svgLines.append("text")							
			.style("fill","white")		
                        .attr("class","encabezado")					
			.style("opacity",0)
			.style("font-family","Cabin")
			.style("font-weight","normal")
			.style("font-size",12*escalaTextos)						
			.style("text-anchor","start")
			.attr("x",offSetLeft+(200*escalaTextos)+10 )
			.attr("y", offSetTop+20 )
			.text(function(){

				return "Solicitado: "+formatNumber((totalCanSol_ref/1000) )+" K TM ";

			}).transition().delay(0).duration(1000)
                        .style("opacity",1 );

        }


        kpiExpert_FR.DrawFilteredHeader=function(){

                svgLines.selectAll(".encabezadoFiltered").data([]).exit().remove();

                if(store.map_var!=kpiExpert_FR){
                        return;
                }

                //if( (store.fillRate.length==store.dataToDraw.length) )
                //return;

                var altura=kpiExpert_FR.altura;

                //Datos
                totalCanEnt_filtered=0;
                totalCanSol_filtered=0;

                vol1_filtered=0;
                vol2_filtered=0;
                vol3_filtered=0;

                por1_filtered=0;
                por2_filtered=0;
                por3_filtered=0;

                for(var k=0;  k < store.dataToDraw.length; k++){  

                         if(store.dataToDraw[k].Agrupador.toLowerCase().indexOf("sacos") > -1 || store.dataToDraw[k].Agrupador.toLowerCase().indexOf("granel") > -1 )
                                    continue;    
                        
                        totalCanSol_filtered+=Number(store.dataToDraw[k][campoTotalSolicitado]);
                        
                        totalCanEnt_filtered+=Number(store.dataToDraw[k][campoDeVolumenFR]);
                        
                        if(store.dataToDraw[k][campoDeATiempo] == "A Tiempo"){
                                vol1_filtered+=Number(store.dataToDraw[k][campoDeVolumenFR]);
                        }else if(store.dataToDraw[k][campoDeATiempo] == "1 a 2 días Tarde"){
                                vol2_filtered+=Number(store.dataToDraw[k][campoDeVolumenFR]);
                        }else if(store.dataToDraw[k][campoDeATiempo] == "3 o más días Tarde"){
                                vol3_filtered+=Number(store.dataToDraw[k][campoDeVolumenFR]);
                        }                 
                }
                

                por1_filtered=Math.round((vol1_filtered/totalCanSol_filtered)*100);
                por2_filtered=Math.round((vol2_filtered/totalCanSol_filtered)*100);
                por3_filtered=Math.round((vol3_filtered/totalCanSol_filtered)*100);          

                // AZUL **********
                
                var ancho2 = GetValorRangos( vol1_filtered ,1, totalCanSol_ref , 1,kpiExpert_FR.ancho-355);


                if(!ancho2)
                ancho2=1;

                if(ancho2 < 1)
                ancho2=1;
                
                svgLines														
                        .append("rect")
                        .attr("fill","#00A8FF")			
                        .attr("filter","url(#glow)")
                        .attr("class","encabezadoFiltered")			
                        .style("opacity",1 )
                        .attr("rx",2)
                        .attr("width",1 )
                        .attr("height",(altura*.4) )
                        .attr("x",kpiExpert_FR.offSetLeft+6+kpiExpert_FR.offSetLeft2)
                        .attr("y",kpiExpert_FR.offSetTop+5+(altura*.18))
                        .transition().delay(0).duration(1000)
                        .style("width",ancho2-2 )
                        ;

                        
                
                // AMARILLO        

                var ancho3 = GetValorRangos( vol2_filtered ,1, totalCanSol_ref , 1,kpiExpert_FR.ancho-355);

                if(ancho3 < 2){
                        ancho3=1;
                }

                if(!ancho3)
                ancho3=1;

                if(ancho3 < 1)
                ancho3=1;

                svgLines														
                        .append("rect")
                        .attr("fill","#FCFF00")                        
                        .attr("filter","url(#glow)")
                        .attr("class","encabezadoFiltered")                       
                        .style("opacity",1 )
                        .attr("rx",2)
                        .attr("width",1 )
                        .attr("height",(altura*.4) )
                        .attr("x",kpiExpert_FR.offSetLeft+ancho2+6+kpiExpert_FR.offSetLeft2 )
                        .attr("y",kpiExpert_FR.offSetTop+5+(altura*.18))
                        .transition().delay(1000).duration(1000)
                        .attr("width",function(d){
                                
                                var ancho_= ancho3; 

                                if(ancho_ > 3)
                                        ancho_=ancho_-2;

                                return ancho_;
                        })
                        ;        

                // ROJO

                var ancho4 = GetValorRangos( vol3_filtered ,1, totalCanSol_ref , 1,kpiExpert_FR.ancho-355);

                if(ancho4 < 2){
                        ancho4=1;
                }

                if(!ancho4)
                ancho4=1;

                if(ancho4 < 1)
                ancho4=1;

                svgLines														
                        .append("rect")
                        .attr("fill","#FF0000")                        
                        .attr("filter","url(#glow)")
                        .attr("class","encabezadoFiltered")                        
                        .style("opacity",1 )
                        .attr("rx",2)
                        .attr("width",1 )
                        .attr("height",(altura*.4) )
                        .attr("x",kpiExpert_FR.offSetLeft+ancho2+ancho3+6+kpiExpert_FR.offSetLeft2)
                        .attr("y",kpiExpert_FR.offSetTop+5+(altura*.18))
                        .transition().delay(2000).duration(1000)
                        .attr("width",function(d){
                                
                                var ancho_= ancho4; 
                                   
                                if(ancho_ > 3)
                                        ancho_=ancho_-2;

                                return ancho_;
                        } )
                        ;
                
                //CIRCULO Y LIENA

                svgLines				
                        .append("circle")
                        .attr("class","encabezadoFiltered")
                        .attr("fill","#ffffff")
                        .attr("cx",kpiExpert_FR.offSetLeft+ancho2+ancho3+ancho4+3+kpiExpert_FR.offSetLeft2 )
                        .attr("cy",kpiExpert_FR.offSetTop+11+(altura*.18))                   
                        .attr("r",3);
              

                // ENTREGADO **********

                if( (store.fillRate.length!=store.dataToDraw.length) ){
        
                        svgLines.append("text")							
                                //.attr("x",20 )
                                //.attr("y", (alturaPorPeriodo*i)+margenSuperior+30  )
                                .style("fill","white")		
                                .attr("class","encabezadoFiltered")					
                                .style("opacity",0)
                                .style("font-family","Cabin")
                                .style("font-weight","normal")
                                .style("font-size",12*escalaTextos)						
                                .style("text-anchor","middle")
                                .attr("x", kpiExpert_FR.offSetLeft+ancho2+ancho3+ancho4+44+kpiExpert_FR.offSetLeft2)
                                .attr("y", kpiExpert_FR.offSetTop+50+(altura*.5))  
                                .text(function(){
                                        
                                        //return "Muestra Solicitado: "+formatNumber(Math.round(totalCanSol_filtered/1000) )+" k Ton - Entregado: "+formatNumber(Math.round(totalCanEnt_filtered/1000) )+" k Ton ("+ Math.round((totalCanEnt_filtered/totalCanSol_filtered)*100) +"%)";
                                        return "Muestra Entregado: "+Math.round((totalCanEnt_filtered/totalCanSol_filtered)*100)+"% , "+formatNumber((totalCanEnt_filtered/1000) )+" K TM  - Solictidado: "+formatNumber((totalCanSol_filtered/1000) )+" K TM  ";

                                })
                                .transition().delay(0).duration(1000)
                                .style("opacity",1 );

                }

                
                // TEXTO AZUL

                svgLines.append("text")							
                        .style("fill","#00A8FF")		
                        .attr("class","encabezadoFiltered")					
                        .style("opacity",0)
                        .style("font-family","Cabin")
                        .style("font-weight","normal")
                        .style("font-size",12*escalaTextos)						
                        .style("text-anchor","middle")
                        .attr("x", kpiExpert_FR.offSetLeft+ancho2+ancho3+ancho4-3+kpiExpert_FR.offSetLeft2 -(6*(escalaTextos*13) ))
                        .attr("y", kpiExpert_FR.offSetTop+35+(altura*.5))  
                        .text(function(){
                                
                                return "A tiempo: "+por1_filtered+"%";

                        })
                        .transition().delay(0).duration(1000)
                        .style("opacity",1 );

                // TEXTO AMARILLO

                svgLines.append("text")							
                        .style("fill","#FCFF00")		
                        .attr("class","encabezadoFiltered")					
                        .style("opacity",0)
                        .style("font-family","Cabin")
                        .style("font-weight","normal")
                        .style("font-size",12*escalaTextos)						
                        .style("text-anchor","middle")
                        .attr("x", kpiExpert_FR.offSetLeft+ancho2+ancho3+ancho4+kpiExpert_FR.offSetLeft2)
                        .attr("y", kpiExpert_FR.offSetTop+35+(altura*.5))  
                        .text(function(){
                                
                                return "1 a 2 días: "+por2_filtered+"%";

                        })
                        .transition().delay(0).duration(1000)
                        .style("opacity",1 );

                // TEXTO ROJO

                svgLines.append("text")							
                        .style("fill","#FF0000")		
                        .attr("class","encabezadoFiltered")					
                        .style("opacity",0)
                        .style("font-family","Cabin")
                        .style("font-weight","normal")
                        .style("font-size",12*escalaTextos)						
                        .style("text-anchor","middle")
                        .attr("x", kpiExpert_FR.offSetLeft+ancho2+ancho3+ancho4+3+kpiExpert_FR.offSetLeft2+(7*(escalaTextos*13) ))
                        .attr("y", kpiExpert_FR.offSetTop+35+(altura*.5))  
                        .text(function(){
                                
                                return "3 Días o mas: "+por3_filtered+"%";

                        })
                        .transition().delay(0).duration(1000)
                        .style("opacity",1 );
                        

 }
    