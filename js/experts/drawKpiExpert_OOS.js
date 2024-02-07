var kpiExpert_OOS={};

kpiExpert_OOS.eraseChart=function(){ 

    d3.select("#svgTooltip").selectAll(".ossDetail").data([]).exit().remove();
    d3.select("#svgTooltip3").selectAll(".ossDetail").data([]).exit().remove();
    d3.select("#svgTooltip4").selectAll(".ossDetail").data([]).exit().remove();

    
    $("#toolTip2").css("visibility","hidden");	
    $("#toolTip2").css("visibility","hidden");	
    $("#toolTip3").css("visibility","hidden");
    $("#toolTip4").css("visibility","hidden");

   
}

kpiExpert_OOS.DrawTooltipDetail=function(entity){    
 
    d3.select("#svgTooltip").selectAll(".ossDetail").data([]).exit().remove();
    d3.select("#svgTooltip3").selectAll(".ossDetail").data([]).exit().remove();
    d3.select("#svgTooltip4").selectAll(".ossDetail").data([]).exit().remove();
    
   
    kpiExpert_OOS.DrawTooltipDetail_Dia(entity);  

    if($("#nivel_cb").val() > 2 ){
        kpiExpert_OOS.DrawTooltipDetail_UN(entity);
        vix_tt_distributeDivs(["#toolTip2","#toolTip3"]); 
    }else{
        kpiExpert_OOS.DrawTooltipDetail_Estado(entity);
       
    }

    opacidadCesium=30;
    $("#cesiumContainer").css("opacity",opacidadCesium/100); 


}

kpiExpert_OOS.DrawTooltipDetail_Estado=function(entity){  

    $("#cargando").css("visibility","visible");

    var serviceName;
    var apiURL;
    var agrupador="";
   

    agrupador="Estado";


    for(var i=0; i < store.apiDataSources.length; i++){          
        if(store.apiDataSources[i].varName=="oos"){
                
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

                    if( store.catlogsForFilters[j].storeProcedureField=="Presentacion" && entity.key=="Sacos" ){
                        params+="&Presentacion=Sacos";
                        continue;
                    }

                    if( store.catlogsForFilters[j].storeProcedureField=="Presentacion" && entity.key=="Granel" ){
                        params+="&Presentacion=Granel";
                        continue;
                    }

                    if(  1 == $("#nivel_cb").val() &&  store.catlogsForFilters[j].storeProcedureField=="RegionZTDem" ){
                        params+="&RegionZTDem="+entity.key;
                        continue;
                    }

                    if(  2 == $("#nivel_cb").val() &&  store.catlogsForFilters[j].storeProcedureField=="vc50_Region_UN" ){
                        params+="&vc50_Region_UN="+entity.key;
                        continue;
                    }

                    if($("#"+store.catlogsForFilters[j].id).val() != "" && $("#"+store.catlogsForFilters[j].id).val() != undefined && $("#"+store.catlogsForFilters[j].id).val() != "Todos"){

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

                var URL=apiURL+"/"+serviceName+"&fechaInicio="+dateInit_+"&fechaFin="+dateEnd_+"&agrupador="+agrupador+""+params;
                console.log(URL);  

               if(URL.indexOf("undefined" < 0)){

                        dataLoader.AddLoadingTitle("OOS por Estado");

                        d3.json(URL, function (error, data) {

                            dataLoader.DeleteLoadingTitle("OOS por Estado"); 

                            dataLoader.HideLoadings();

                                $("#cargando").css("visibility","hidden");
                                
                                if(error){
                                    alert("Error API OOS",error);
                                    resolve();
                                    return;
                                }

                                if(data.error){
                                    alert("Error API OOS",data.error);
                                    resolve();
                                    return;
                                }

                                console.log("oos",data.recordset);

                                d3.select("#svgTooltip4").selectAll(".ossDetail").data([]).exit().remove();

                                var maximo=0;
                                var maximoVolumen=0;                                  

                                var arr=d3.nest()
                                    .key(function(d) { return d.Agrupador; })
                                    .entries(data.recordset);  

                                    console.log("arr",arr);

                                for(var i=0; i < arr.length; i++ ){

                                    arr[i].Numerador=0;
                                    arr[i].Denominador=0;
                                    arr[i].CantEntFinal=0;
                            
                                    for(var j=0; j < arr[i].values.length; j++ ){
                                        
                                        arr[i].Numerador+=Number(arr[i].values[j].Numerador);
                                        arr[i].Denominador+=Number(arr[i].values[j].Denominador);
                                        arr[i].CantEntFinal+=Number(arr[i].values[j].CantEntFinal);            
                            
                                        if(maximoVolumen < arr[i].CantEntFinal){
                                            maximoVolumen=arr[i].CantEntFinal;
                                        }
                            
                                    }
                            
                                } 
                                
                                for(var i=0; i < arr.length; i++ ){
                                    arr[i].OOS=Math.round(  (arr[i].Numerador/arr[i].Denominador)*10000)/100;
                                    if(maximo < arr[i].OOS*1000){
                                        maximo=arr[i].OOS*1000;
                                    }
                                }
                            
                                arr = arr.sort((a, b) => b.OOS*1000 - a.OOS*1000);
                            
                                var altura=30;
                               
                                var svgTooltipHeight=arr.length*altura;
                            
                                if(svgTooltipHeight<80)
                                    svgTooltipHeight=80;
                            
                                if(svgTooltipHeight>windowHeight*.8)
                                    svgTooltipHeight=windowHeight*.8;
                            
                                var svgTooltipWidth=600;
                                //var marginLeft=svgTooltipWidth*.3;
                                var tamanioFuente=altura*.5;
                                if(tamanioFuente < 12)
                                tamanioFuente=12;
                            
                                //var marginTop=30;
                            
                            
                                $("#toolTip4").css("visibility","visible");            
                                $("#toolTip4").css("left",radio+"px"); 
                                $("#toolTip4").css("top",80+"px");
                            
                                if(windowWidth > 1500 ){
                            
                                    $("#toolTip4").css("top",80+"px");
                                    $("#toolTip4").css("left",radio+"px");
                                   
                                }

                                // DATOS 
                                var data = arr.map(function(item) {
                                    return {
                                    key: item.key,
                                    "Numero": item.Numerador,
                                    "OOS": item.OOS,
                                    "Numera": item.CantEntFinal,
                                    };
                                    }); 


                                // DEFINE COLUMNAS
      
                                var columns = [
                                    { key: "key", header: "Estado", sortable: true, width: "120px" },
                                    { key: "Numero", header: "# OOS", sortable: true, width: "120px" },
                                    { key: "OOS", header: "% OOS", sortable: true, width: "120px" },
                                    { key: "Numera", header: "Volumen Entregado", sortable: true, width: "120px" },
                                
                                ];        
      
                                 // DEFINE VISITORS PARA CADA COLUMNA    
    
                                var columnVisitors = {
                                    key: function(value) {
                                        return `<div class="key-selector" onclick="backInfoNav.push({entity:'${entity.key}' , catlog:'${dataManager.getCurrentCatlog()}'});filterControls.arrowUpdate();filterControls.lookForEntity('${value}','cat_estado','${entity.key}')">${value}
                                        </div>`;
                                    },
                                
                                    Numero: function(value) {
                                    return vix_tt_formatNumber(value);
                                    },
                                
                                        OOS: function(value){
                                
                                        var barWidth = value + '%';
                                        var barValue = vix_tt_formatNumber(value)+'%   ';
                                    
                                        return '<div class="bar-container">' +
                                                '<span class="bar-value">' + barValue + '</span>' + '<svg width="100%" height="10">'  
                                                + '<rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: white;"></rect></svg>' +        
                                            '</div>';
                                    },
                                    Numera: function(value){
                                
                                        var barWidth = (value/maximoVolumen)*100 + '%';
                                        var barValue = vix_tt_formatNumber(value);
                                
                                    return '<div class="bar-container">' +
                                                '<span class="bar-value">' + barValue + '</span>' + '<svg width="100%" height="10">'  
                                                + '<rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: white;"></rect></svg>' +        
                                            '</div>';
                                    }
                                };
                                

                                // FORMATEA DIV :
                                
                                vix_tt_formatToolTip("#toolTip4","Out of Stock por Estado de "+dataManager.getNameFromId(entity.key),490,svgTooltipHeight+100,dataManager.GetTooltipInfoData("toolTip4","OOS Cedis"));
      

                                // COLUMNAS CON TOTALES :
                                var columnsWithTotals = ['Numero','','Numera']; 
                                var totalsColumnVisitors = {
                                            'Numero': function(value) { 
                                            return vix_tt_formatNumber(value) ; 
                                            },
                                            'Numera': function(value) { 
                                            return vix_tt_formatNumber(value) ;
                                            },                   
                                            
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

                                vix_tt_distributeDivs(["#toolTip4","#toolTip3"]); 

                        });


               }

    }

}

kpiExpert_OOS.DrawTooltipDetail_UN=function(entity){    

    d3.select("#svgTooltip").selectAll(".ossDetail").data([]).exit().remove();

    var maximo=0;
    var maximoVolumen=0;   

    for(var i=0; i < entity.oos.values.length; i++ ){

        entity.oos.values[i].grupo=entity.oos.values[i].DescrProducto+"_"+entity.oos.values[i].Destino;       

    }

    var arr=d3.nest()
            .key(function(d) { return d.Destino; })
            .entries(entity.oos.values);     
            
            console.log("arr",entity);
    
    for(var i=0; i < arr.length; i++ ){

        arr[i].Numerador=0;
        arr[i].Denominador=0;
        arr[i].CantEntFinal=0;

        for(var j=0; j < arr[i].values.length; j++ ){
            
            arr[i].Numerador+=Number(arr[i].values[j].Numerador);
            arr[i].Denominador+=Number(arr[i].values[j].Denominador);
            arr[i].CantEntFinal+=Number(arr[i].values[j].CantEntFinal);            

            if(maximoVolumen < arr[i].CantEntFinal){
                maximoVolumen=arr[i].CantEntFinal;
            }

        }

    }    

    for(var i=0; i < arr.length; i++ ){
        arr[i].OOS=Math.round(  (arr[i].Numerador/arr[i].Denominador)*10000)/100;
        if(maximo < arr[i].OOS*1000){
            maximo=arr[i].OOS*1000;
        }
    }

    arr = arr.sort((a, b) => b.OOS*1000 - a.OOS*1000);

    var altura=30;
   
    var svgTooltipHeight=arr.length*altura;

    if(svgTooltipHeight<80)
        svgTooltipHeight=80;

    if(svgTooltipHeight>windowHeight*.8)
        svgTooltipHeight=windowHeight*.8;

    var svgTooltipWidth=600;
    //var marginLeft=svgTooltipWidth*.3;
    var tamanioFuente=altura*.5;
    if(tamanioFuente < 12)
    tamanioFuente=12;

    //var marginTop=30;


    $("#toolTip2").css("visibility","visible");            
    $("#toolTip2").css("left",radio+"px"); 
    $("#toolTip2").css("top",80+"px");

    if(windowWidth > 1500 ){

        $("#toolTip2").css("top",80+"px");
        $("#toolTip2").css("left",radio+"px");
       
    }

    // DATOS 
    var data = arr.map(function(item) {
        return {
          key: item.key,
          "Numero": item.Numerador,
          "OOS": item.OOS,
          "Numera": item.CantEntFinal,
        };
        });  
    
        // DEFINE COLUMNAS
      
        var columns = [
            { key: "key", header: "Unidad de Negocio", sortable: true, width: "120px" },
            { key: "Numero", header: "# OOS", sortable: true, width: "120px" },
            { key: "OOS", header: "% OOS", sortable: true, width: "120px" },
            { key: "Numera", header: "Volumen Entregado", sortable: true, width: "120px" },
          
          ];        
      
       // DEFINE VISITORS PARA CADA COLUMNA    
    
       var columnVisitors = {
        key: function(value) {
            return `<div class="key-selector" onclick="backInfoNav.push({entity:'${entity.key}' , catlog:'${dataManager.getCurrentCatlog()}'});filterControls.arrowUpdate();filterControls.lookForEntity('${value}','cat_un','${entity.key}')">${value}
            </div>`;
          },
    
          Numero: function(value) {
          return vix_tt_formatNumber(value);
        },
       
            OOS: function(value){
      
            var barWidth = value + '%';
            var barValue = vix_tt_formatNumber(value)+'%   ';
        
            return '<div class="bar-container">' +
                    '<span class="bar-value">' + barValue + '</span>' + '<svg width="100%" height="10">'  
                    + '<rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: white;"></rect></svg>' +        
                   '</div>';
        },
        Numera: function(value){
      
            var barWidth = (value/maximoVolumen)*100 + '%';
            var barValue = vix_tt_formatNumber(value);
       
           return '<div class="bar-container">' +
                    '<span class="bar-value">' + barValue + '</span>' + '<svg width="100%" height="10">'  
                    + '<rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: white;"></rect></svg>' +        
                  '</div>';
        }
      };
    

      // FORMATEA DIV :
      
      vix_tt_formatToolTip("#toolTip2","Out of Stock de "+dataManager.getNameFromId(entity.key),490,svgTooltipHeight+100,dataManager.GetTooltipInfoData("toolTip2","OOS Cedis"));
      
        // COLUMNAS CON TOTALES :

        var columnsWithTotals = ['Numero','','Numera']; 
        var totalsColumnVisitors = {
                    'Numero': function(value) { 
                    return vix_tt_formatNumber(value) ; 
                    },
                    'Numera': function(value) { 
                    return vix_tt_formatNumber(value) ;
                    },                   
                    
                    };
      
        // CREA TABLA USANDO DATOS
            
        vix_tt_table_extended(data, columns, columnVisitors, totalsColumnVisitors, "toolTip2", columnsWithTotals );        

        // Crea una barra inferior y pasa una funcion de exportacion de datos
        vix_tt_formatBottomBar("#toolTip2", function () {
        var dataToExport = formatDataForExport(data, columns);
        var filename = "exported_data";
        exportToExcel(dataToExport, filename);
        });
            
            
            
        // APLICA TRANSICIONES 

        vix_tt_transitionRectWidth("toolTip2");
 

}

kpiExpert_OOS.DrawTooltipDetail_Dia=function(entity){ 

    var maximo=0;
    var maximo2=0;
    var maximo3=0;

            var arr=d3.nest()
                    .key(function(d) { 

                            if(d.fecha){
                                    return d.fecha.getTime(); 
                            }else{                       
                                    return 0;
                            }                        
            
                    })
                    .entries(entity.oos.values);

            var fechas={};

            for(var i=0; i < arr.length; i++ ){

                    arr[i].Numerador=0;
                    arr[i].Denominador=0;
                    arr[i].Fisico=0;
                    arr[i].fecha=arr[i].values[0].fecha.getTime();

                    fechas[arr[i].values[0].fecha.getDate()+"_"+arr[i].values[0].fecha.getDay()]=true;
               
                    for(var j=0; j < arr[i].values.length; j++ ){
            
                        arr[i].Numerador+=Number(arr[i].values[j].Numerador);
                        arr[i].Denominador+=Number(arr[i].values[j].Denominador);
                        arr[i].Fisico+=Number(arr[i].values[j].Fisico);

                    }

                    if(maximo2 < arr[i].Fisico)
                        maximo2 = arr[i].Fisico;

                    if(maximo3 < arr[i].Numerador)
                        maximo3 = arr[i].Numerador;
        
            }

            for(var i=0; i < arr.length; i++ ){
                    arr[i].OOS=Math.round(  (arr[i].Numerador/arr[i].Denominador)*10000)/100;
                    
                    if(maximo < arr[i].OOS*1000){
                        maximo=arr[i].OOS*1000;
                    }
            }           

            arr = arr.sort((a, b) => {                
                return b.fecha - a.fecha;                                    
        
            }); 

            var arrTemp=[];

            var dia=((1000*60)*60)*23.9;

            arr=arr.reverse();


            for(var i=0; i < arr.length; i++ ){

                    arrTemp.push(arr[i]);
                   
                    var date_=new Date(arr[i].fecha);

                    if(date_.getDay()==5){

                            var sabado=new Date(arr[i].fecha+dia);
                          
                            if(!fechas[sabado.getDate()+"_"+sabado.getDay()] ){
                               
                                    arrTemp.push({
                                        Numerador:0,
                                        Denominador:0,
                                        Fisico:0,
                                        fecha:new Date(arr[i].fecha+dia),
                                        OOS:0,
                                        agregado:true,
                                        key:arr[i].fecha+dia
                                    });

                            }

                    }

                   
                    if(date_.getDay()==6){
                       
                            var domingo=new Date(arr[i].fecha+dia+dia );
                         
                            if(!fechas[domingo.getDate()+"_"+domingo.getDay()] ){
                                
                                    arrTemp.push({
                                        Numerador:0,
                                        Denominador:0,
                                        Fisico:0,
                                        fecha:new Date(arr[i].fecha+dia+dia),
                                        OOS:0,
                                        agregado:true,
                                        key:arr[i].fecha+dia+dia
                                    });

                            }
                    }

            }

            arr=arrTemp;            
        
            var ancho=18;
            
            var svgTooltipWidth=arr.length*(ancho*1.05);

            if(svgTooltipWidth < 180)
            svgTooltipWidth=180;

            var svgTooltipHeight=600;
            var tamanioFuente=ancho*.7;   
        
            $("#toolTip3").css("visibility","visible");  
            $("#toolTip3").css("inset",""); 
            $("#toolTip3").css("top",80+"px");
            $("#toolTip3").css("right","1%");

            if(windowWidth > 1500 ){

                $("#toolTip3").css("top",80+"px");
                $("#toolTip3").css("left",windowWidth*.6+"px");
                $("#toolTip3").css("right","");
               
        }   
        
            var marginBottom=svgTooltipHeight*.02;

            // FORMATEA TOOL TIP :
            
            vix_tt_formatToolTip("#toolTip3","Out of Stock por Día de "+dataManager.getNameFromId(entity.key),svgTooltipWidth+10,svgTooltipHeight+10,dataManager.GetTooltipInfoData("toolTip3","OOS Cedis"));
        
            // Agrega un div con un elemento svg :
        
            var svgElement = "<svg id='svgTooltip3' style='pointer-events:none;'></svg>";
            d3.select("#toolTip3").append("div").html(svgElement);
        
            d3.select("#svgTooltip3")                     
                .style("width", svgTooltipWidth )
                .style("height", (svgTooltipHeight)+50 );


            for(var i=0; i < arr.length; i++ ){   

               
                var altura1=GetValorRangos( arr[i].OOS*1000,1, maximo ,1,svgTooltipHeight*.21);
                var altura2=GetValorRangos( arr[i].Fisico ,1, maximo2 ,1,svgTooltipHeight*.21   );
                var altura3=GetValorRangos( arr[i].Numerador ,0, maximo3 ,1,svgTooltipHeight*.21   );

                if(maximo==0)
                altura1=1;

                if(maximo2==0)
                altura2=1;

                if(maximo3==0)
                altura3=1;
                
                /*
                
                var color="#1ADD00";

                if(arr[i].OOS > 8){
                    color="#ff0000";
                }else if(arr[i].OOS > 5.9){
                    color="#FCFF11";
                }

                d3.select("#svgTooltip3").append("rect")		    		
                                .attr("width",ancho*.8 )
                                .attr("class","ossDetail")
                                .attr("x",(ancho*i)  )
                                .attr("y", (svgTooltipHeight*.85)-altura1-marginBottom  )
                                .attr("height",altura1)
                                .attr("fill",color)
                                .style("pointer-events","auto")
                                ;
                                */
                               	
        
                d3.select("#svgTooltip3").append("rect")		    		
                                .attr("width",ancho*.8 )
                                .attr("class","ossDetail")
                                .attr("x",(ancho*i)  )
                                .attr("y", (svgTooltipHeight*.35)-altura2-marginBottom  )
                                .attr("height",altura2)
                                .attr("fill","#ffffff")
                                .style("pointer-events","auto")
                                ;

                d3.select("#svgTooltip3").append("rect")		    		
                                .attr("width",ancho*.8 )
                                .attr("class","ossDetail")
                                .attr("x",(ancho*i)  )
                                .attr("y", (svgTooltipHeight*.75)-altura3-marginBottom  )
                                .attr("height",altura3)
                                .attr("fill","#0090FF")
                                .style("pointer-events","auto")
                                ;


                d3.select("#svgTooltip3")
                                .append("text")						
                                .attr("class","ossDetail")
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
                                .attr("transform"," translate("+String( (ancho*i)+tamanioFuente-2  )+","+String( (svgTooltipHeight*.85)-marginBottom-2   )+")  rotate("+(-90)+") ")
                                .text(function(){

                                    if(arr[i].OOS.toString()=="Infinity" || arr[i].OOS.toString()=="NaN")
                                        return "";

                                    return  formatNumber(arr[i].OOS,true)+"%" ;
                
                                });
                /*
                d3.select("#svgTooltip3")
                                .append("text")						
                                .attr("class","ossDetail")
                                .style("fill",function(d){
                                    
                                    var color ="#C6C6C6";

                                    if(arr[i].agregado){
                                        color ="#5C5C5C";
                                    }
                                    
                                    return color;
                                    
                                })		
                                .style("font-family","Cabin")
                                .style("font-weight","bold")
                                .style("font-size",tamanioFuente)	
                                .style("text-anchor","end")
                                .attr("transform"," translate("+String( (ancho*i)+tamanioFuente-2  )+","+String( (svgTooltipHeight*.87)-marginBottom   )+")  rotate("+(-90)+") ")
                                .text(function(){
                                
                                    var date=new Date( Number(arr[i].key) );
                
                                    return  date.getDate()+" "+getMes(date.getMonth());
                
                                }); 
                                */
                                
                d3.select("#svgTooltip3")
                                .append("text")						
                                .attr("class","ossDetail")
                                .style("fill",function(d){
                                    
                                    var color ="#C6C6C6";

                                    if(arr[i].agregado){
                                        color ="#5C5C5C";
                                    }
                                    
                                    return color;
                                    
                                })		
                                .style("font-family","Cabin")
                                .style("font-weight","bold")
                                .style("font-size",tamanioFuente)	
                                .style("text-anchor","end")
                                .attr("transform"," translate("+String( (ancho*i)+tamanioFuente-2  )+","+String( (svgTooltipHeight*.37)-marginBottom-3+3   )+")  rotate("+(-90)+") ")
                                .text(function(){
                                
                                    var date=new Date( Number(arr[i].key) );
                
                                    return  date.getDate()+" "+getMes(date.getMonth());
                
                                }); 

                d3.select("#svgTooltip3")
                                .append("text")						
                                .attr("class","ossDetail")
                                .style("fill","#ffffff")		
                                .style("font-family","Cabin")
                                .style("font-weight","bold")
                                .style("font-size",tamanioFuente)	
                                .style("text-anchor","start")
                                .attr("transform"," translate("+String( (ancho*i)+tamanioFuente-2  )+","+String( (svgTooltipHeight*.47)-altura2-marginBottom-3   )+")  rotate("+(-90)+") ")
                                .text(function(){
                                
                                    return  formatNumber(arr[i].Fisico) ;
                
                                });
                
                d3.select("#svgTooltip3")
                                .append("text")						
                                .attr("class","ossDetail")
                                .style("fill","#ffffff")		
                                .style("font-family","Cabin")
                                .style("font-weight","bold")
                                .style("font-size",tamanioFuente)	
                                .style("text-anchor","start")
                                .attr("transform"," translate("+String( (ancho*i)+tamanioFuente-2  )+","+String( (svgTooltipHeight*.75)-altura3-marginBottom-3   )+")  rotate("+(-90)+") ")
                                .text(function(){
                                
                                    return  formatNumber(arr[i].Numerador) ;
                
                                });                

            }

            //TITULOS
            d3.select("#svgTooltip3")
                .append("text")						
                .attr("class","ossDetail")
                .style("fill","#ffffff")		
                .style("font-family","Cabin")
                .style("font-weight","normal")
                .style("font-size",tamanioFuente)	
                .style("text-anchor","start")
                .attr("transform"," translate("+String( 3  )+","+String( 20 )+")  rotate("+(0)+") ")
                .text("Inventario (TM):"); 

            

            d3.select("#svgTooltip3")
                .append("text")						
                .attr("class","ossDetail")
                .style("fill","#ffffff")		
                .style("font-family","Cabin")
                .style("font-weight","normal")
                .style("font-size",tamanioFuente)	
                .style("text-anchor","start")
                .attr("transform"," translate("+String( 3  )+","+String( svgTooltipHeight*.46  )+")  rotate("+(0)+") ")
                .text("Cantidad OOS:");
        

}