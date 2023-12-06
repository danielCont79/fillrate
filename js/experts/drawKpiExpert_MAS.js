var kpiExpert_MAS={};


kpiExpert_MAS.eraseChart=function(){ 

    d3.select("#svgTooltip").selectAll(".masDetail").data([]).exit().remove();
    d3.select("#svgTooltip3").selectAll(".masDetail").data([]).exit().remove();
    
    $("#toolTip2").css("visibility","hidden");	 
    $("#toolTip3").css("visibility","hidden");
    $("#toolTip4").css("visibility","hidden");  

}

kpiExpert_MAS.DrawTooltipDetail=function(entity){  

    d3.select("#svgTooltip").selectAll(".masDetail").data([]).exit().remove();
    d3.select("#svgTooltip3").selectAll(".masDetail").data([]).exit().remove();

    $("#toolTip2").css("visibility","hidden");	 
    $("#toolTip3").css("visibility","hidden");
    $("#toolTip4").css("visibility","hidden");
    
    //Ventanas segun nivel de lectura:
    
    if($("#nivel_cb").val() < 3){ // Nacional o regiones
      kpiExpert_MAS.registredWindows.push("toolTip2");
      kpiExpert_MAS.DrawTooltipDetail_Estado(entity);
    }
    
    if($("#nivel_cb").val() ==3 || $("#nivel_cb").val() ==4 ){ // estado o gerencia 
      kpiExpert_MAS.registredWindows.push("#toolTip3");
      kpiExpert_MAS.DrawTooltipDetail_UN(entity);
    }

    if($("#nivel_cb").val() == 3 ){// estado 
      kpiExpert_MAS.registredWindows.push("#toolTip4");
      kpiExpert_MAS.DrawTooltipDetail_GenericaMas(entity,"Holding","cat_cliente_estado");
    }

    if($("#nivel_cb").val() == 5  ){//  UN 
      kpiExpert_MAS.registredWindows.push("#toolTip4");
      kpiExpert_MAS.DrawTooltipDetail_GenericaMas(entity,"Holding","cat_cliente_estado");
    }

    if($("#nivel_cb").val() == 7 ){// ZT debe ver holding
      kpiExpert_MAS.registredWindows.push("#toolTip4");
      kpiExpert_MAS.DrawTooltipDetail_GenericaMas(entity,"Holding","cat_cliente_estado");
    }

    if($("#nivel_cb").val() == 6 ){// Holding debe ver sucrusal
      kpiExpert_MAS.registredWindows.push("#toolTip4");
      kpiExpert_MAS.DrawTooltipDetail_GenericaMas(entity,"Obra","cat_sucursal_estado");
    }

    if($("#nivel_cb").val() == 8 ){// Sucrusal-Obra debe ver frente
      kpiExpert_MAS.registredWindows.push("#toolTip4");
      kpiExpert_MAS.DrawTooltipDetail_GenericaMas(entity,"Frente","cat_frente");
    }

    //********************************************************************** */    

    opacidadCesium=30;
    $("#cesiumContainer").css("opacity",opacidadCesium/100);

    // DISTRIBUYE 
    vix_tt_distributeDivs(["#toolTip2","#toolTip3"]);  

}

kpiExpert_MAS.registredWindows=[];
kpiExpert_MAS.sortRegistredWindows=function(){

  vix_tt_distributeDivs(kpiExpert_MAS.registredWindows); 

}


kpiExpert_MAS.DrawTooltipDetail_GenericaMas=function(entity, agrupador ,catlog){  

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

                var URL=apiURL+"/"+serviceName+"?fechaInicio="+dateInit_+"&fechaFin="+dateEnd_+"&agrupador="+agrupador+""+params;
                console.log(URL);

                if(URL.indexOf("undefined" < 0)){
        
                  dataLoader.AddLoadingTitle("Masivos por "+agrupador);
          
                      d3.json(URL, function (error, data) {
          
                                  $("#cargando").css("visibility","hidden");
  
                                  dataLoader.DeleteLoadingTitle("Masivos por "+agrupador); 
  
                                  dataLoader.HideLoadings();
  
                                  if(error){
                                          alert("Error API Masivos por "+agrupador,error);
                                       
                                          return;
                                  }
                  
                                  if(data.error){
                                          alert("Error API Masivos por "+agrupador,data.error);
                                        
                                          return;
                                  }
                  
                                  console.log("FR por "+agrupador,data.recordset);

                                  var maximo=0;
                                    var maximoVol=0;

                                    var arrTemp=[];

                                    var arr=d3.nest()
                                            .key(function(d) { return d.Agrupador; })
                                            .entries(data.recordset); 

                                    for(var i=0; i < arr.length; i++ ){

                                          arr[i].Masivos=0; 
                                          arr[i].MasivosVol=0;
                                          arr[i].totalSolicitado=0;      
                                          
                                          for(var j=0; j < arr[i].values.length; j++ ){

                                                if( arr[i].values[j].TipoPedido != "Estándar" && arr[i].values[j].TipoPedido != "Estandar" ){

                                                    arr[i].MasivosVol+=Number(arr[i].values[j].CantSolFinal);
                                            
                                                }
                                    
                                                arr[i].totalSolicitado+=Number(arr[i].values[j].CantSolFinal);     

                                          }

                                          arr[i].Masivos=arr[i].MasivosVol/arr[i].totalSolicitado;

                                          if(maximo < arr[i].Masivos*1000){
                                              maximo=arr[i].Masivos*1000;
                                          }
                                          if(maximoVol < arr[i].totalSolicitado){
                                              maximoVol=arr[i].totalSolicitado;
                                          }

                                    }

                                    console.log(arr);

                                    arr = arr.sort((a, b) => b.Masivos*100 - a.Masivos*100);

                                    var altura=30;
                                    var caso=0;
                                  
                                    var svgTooltipHeight=(arr.length*altura)+50;

                                    if(svgTooltipHeight<80)
                                      svgTooltipHeight=80;
                                
                                    if(svgTooltipHeight>windowHeight*.8)
                                      svgTooltipHeight=windowHeight*.8;
                                
                                    var svgTooltipWidth=600;
                                    var marginLeft=svgTooltipWidth*.3;
                                    var tamanioFuente=altura*.5;
                                    if(tamanioFuente < 12)
                                    tamanioFuente=12;
                                
                                    var marginTop=30;
                                
                                    $("#toolTip4").css("visibility","visible");            
                                    $("#toolTip4").css("left",34+"%");
                                    $("#toolTip4").css("top",80+"px");


                                    var data = arr.map(function(item) {
                                      return {
                                        key: item.key,
                                        "MasivosVol": item.MasivosVol,      
                                        "totalSolicitado": item.totalSolicitado,
                                        "DifP": ((item.MasivosVol / item.totalSolicitado)) *100
                                      };
                                      });
                              
                                  // DEFINE COLUMNAS
                                    
                                  var columns = [
                                      { key: "key", header: agrupador, sortable: true, width: "130px" },
                                      { key: "MasivosVol", header: "Volumen Masivos", sortable: true, width: "150px" },    
                                      { key: "totalSolicitado", header: "Vol. Solicitado", sortable: true, width: "150px" },
                                      { key: "DifP", header: "Procentaje", sortable: true, width: "150px" },
                                      ];



                                  var columnVisitors = {
                                    key: function(value,i) {
                                        return `<div class="key-selector" onclick="backInfoNav.push({entity:'${entity.key}' , catlog:'${dataManager.getCurrentCatlog()}'});filterControls.arrowUpdate();filterControls.lookForEntity('${value}','cat_estado','${entity.key}')">${dataManager.getNameFromIdFromCatlog(value , catlog)}
                                        </div>`;
                                      },
                                
                                    MasivosVol: function(value,i) {
                                            var ancho=GetValorRangos( value,1, maximo ,1,svgTooltipHeight*.4);
                                            var barValue = formatNumber(value);
                                          
                                          

                                            return '<div class="bar-container">' +
                                          
                                            '<span class="bar-value">' + barValue + '</span>' +
                                            '</div>';
                        
                                    },
                                    
                                    totalSolicitado: function(value,i) {
                                            var ancho=GetValorRangos( value,1, maximoVol ,1,svgTooltipHeight*.4);
                                            var barValue = formatNumber(value);              
                                          

                                            return '<div class="bar-container">' +
                                          
                                            '<span class="bar-value">' + barValue + '</span>' +
                                            '</div>';
                        
                                    }, 
                                    DifP: function(value,i) {
                                        var ancho=GetValorRangos( value,1, maximoVol ,1,svgTooltipHeight*.4);
                                        var barValue = formatNumber(value)+" %";              
                                      

                                        return '<div class="bar-container">' +
                                      
                                        '<span class="bar-value">' + barValue + '</span>' +
                                        '</div>';
                                            
                                    }
                                };

                                // COLUMNAS CON TOTALES :

                                var columnsWithTotals = ['MasivosVol','totalSolicitado','DifP']; 
                                var totalsColumnVisitors = {
                                    'MasivosVol': function(value) { 
                                            var v = formatNumber(value);
                                
                                            return v; 
                                    },
                                    'totalSolicitado': function(value) { 
                                            var v = formatNumber(value);
                                
                                            return v; 
                                    }               
                                  };
                      
                                  // FORMATEA DIV :

                                  vix_tt_formatToolTip("#toolTip4","Masivos por "+agrupador+" de "+dataManager.getNameFromId(entity.key)+" (TM)", 600, svgTooltipHeight+100,dataManager.GetTooltipInfoData("toolTip4","Masivos"));
                                
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

                                  drawKpiExpert_VENTAS.sortRegistredWindows(); 

                      });

                }

              }


}

kpiExpert_MAS.DrawTooltipDetail_UN=function(entity){

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


      console.log("serviceName",serviceName);

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
          params+="&masivos=Todos";  
          
          //ID de entidad
          params+="&idSpider="+entity.key;

          var URL=apiURL+"/"+serviceName+"?fechaInicio="+dateInit_+"&fechaFin="+dateEnd_+"&agrupador="+agrupador+params;
          console.log(URL);  

          if(URL.indexOf("undefined" < 0)){

            dataLoader.AddLoadingTitle("Masivos de Unidades de Neg");            

            d3.json(URL, function (error, data) {

                  dataLoader.DeleteLoadingTitle("Masivos de Unidades de Neg"); 

                  $("#cargando").css("visibility","hidden");

                  if(error){
                          alert("Error API Masivos UN",error);
                          resolve();
                          return;
                  }

                  if(data.error){
                          alert("Error API Masivos UN",data.error);
                          resolve();
                          return;
                  }

                  console.log("Masivos de UN",data.recordset); 

                  var maximo=0;
                  var maximoVol=0;

                  var arrTemp=[];

                  var arr=d3.nest()
                          .key(function(d) { return d.vc50_UN_Tact; })
                          .entries(data.recordset); 

                  for(var i=0; i < arr.length; i++ ){

                        arr[i].Masivos=0; 
                        arr[i].MasivosVol=0;
                        arr[i].totalSolicitado=0;      
                        
                        for(var j=0; j < arr[i].values.length; j++ ){

                              if( arr[i].values[j].TipoPedido != "Estándar" && arr[i].values[j].TipoPedido != "Estandar" ){

                                  arr[i].MasivosVol+=Number(arr[i].values[j].CantSolFinal);
                          
                              }
                  
                              arr[i].totalSolicitado+=Number(arr[i].values[j].CantSolFinal);     

                        }

                        arr[i].Masivos=arr[i].MasivosVol/arr[i].totalSolicitado;

                        if(maximo < arr[i].Masivos*1000){
                            maximo=arr[i].Masivos*1000;
                        }
                        if(maximoVol < arr[i].totalSolicitado){
                            maximoVol=arr[i].totalSolicitado;
                        }

                  }

                  console.log(arr);

                  arr = arr.sort((a, b) => b.Masivos*100 - a.Masivos*100);

                  var altura=30;
                  var caso=0;
                
                  var svgTooltipHeight=(arr.length*altura)+50;

                  if(svgTooltipHeight<80)
                    svgTooltipHeight=80;
              
                  if(svgTooltipHeight>windowHeight*.8)
                    svgTooltipHeight=windowHeight*.8;
              
                  var svgTooltipWidth=600;
                  var marginLeft=svgTooltipWidth*.3;
                  var tamanioFuente=altura*.5;
                  if(tamanioFuente < 12)
                  tamanioFuente=12;
              
                  var marginTop=30;
              
                  $("#toolTip3").css("visibility","visible");            
                  $("#toolTip3").css("left",34+"%");
                  $("#toolTip3").css("top",80+"px");


                  var data = arr.map(function(item) {
                    return {
                      key: item.key,
                      "MasivosVol": item.MasivosVol,      
                      "totalSolicitado": item.totalSolicitado,
                      "DifP": ((item.MasivosVol / item.totalSolicitado)) *100
                    };
                    });
            
                // DEFINE COLUMNAS
                  
                 var columns = [
                    { key: "key", header: "Unidad Neg.", sortable: true, width: "130px" },
                    { key: "MasivosVol", header: "Volumen Masivos", sortable: true, width: "150px" },    
                    { key: "totalSolicitado", header: "Vol. Solicitado", sortable: true, width: "150px" },
                    { key: "DifP", header: "Procentaje", sortable: true, width: "150px" },
                    ];



                var columnVisitors = {
                  key: function(value,i) {
                      return `<div class="key-selector" onclick="backInfoNav.push({entity:'${entity.key}' , catlog:'${dataManager.getCurrentCatlog()}'});filterControls.arrowUpdate();filterControls.lookForEntity('${value}','cat_estado','${entity.key}')">${value}
                      </div>`;
                    },
              
                  MasivosVol: function(value,i) {
                          var ancho=GetValorRangos( value,1, maximo ,1,svgTooltipHeight*.4);
                          var barValue = formatNumber(value);
                        
                        

                          return '<div class="bar-container">' +
                        
                          '<span class="bar-value">' + barValue + '</span>' +
                          '</div>';
      
                  },
                  
                  totalSolicitado: function(value,i) {
                          var ancho=GetValorRangos( value,1, maximoVol ,1,svgTooltipHeight*.4);
                          var barValue = formatNumber(value);              
                        

                          return '<div class="bar-container">' +
                        
                          '<span class="bar-value">' + barValue + '</span>' +
                          '</div>';
      
                  }, 
                  DifP: function(value,i) {
                      var ancho=GetValorRangos( value,1, maximoVol ,1,svgTooltipHeight*.4);
                      var barValue = formatNumber(value)+" %";              
                    

                      return '<div class="bar-container">' +
                    
                      '<span class="bar-value">' + barValue + '</span>' +
                      '</div>';
                          
                  }
              };

               // COLUMNAS CON TOTALES :

              var columnsWithTotals = ['MasivosVol','totalSolicitado','DifP']; 
              var totalsColumnVisitors = {
                  'MasivosVol': function(value) { 
                          var v = formatNumber(value);
              
                          return v; 
                  },
                  'totalSolicitado': function(value) { 
                          var v = formatNumber(value);
              
                          return v; 
                  }               
                };
    
                // FORMATEA DIV :

                vix_tt_formatToolTip("#toolTip3","Masivos por U.N. de "+dataManager.getNameFromId(entity.key)+" (TM)", 600, svgTooltipHeight+100,dataManager.GetTooltipInfoData("toolTip3","Masivos"));
              
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

                drawKpiExpert_VENTAS.sortRegistredWindows(); 

            });


          }


      }

}

kpiExpert_MAS.DrawTooltipDetail_Estado=function(entity){

    d3.select("#svgTooltip").selectAll(".masDetail").data([]).exit().remove();

    var maximo=0;
    var maximoVol=0;
    var arr=d3.nest()
            .key(function(d) { return d.EstadoZTDem; })
            .entries(entity.masivos.values);


    for(var i=0; i < arr.length; i++ ){

        arr[i].Masivos=0; 
        arr[i].MasivosVol=0;
        arr[i].totalSolicitado=0;    

        for(var j=0; j < arr[i].values.length; j++ ){
            
            if( arr[i].values[j].TipoPedido == "Masivo" ){

                arr[i].MasivosVol+=Number(arr[i].values[j].CantSolFinal);
          
            }

            arr[i].totalSolicitado+=Number(arr[i].values[j].CantSolFinal);            

        }

        arr[i].Masivos=arr[i].MasivosVol/arr[i].totalSolicitado;

        if(maximo < arr[i].Masivos*1000){
            maximo=arr[i].Masivos*1000;
        }
        if(maximoVol < arr[i].totalSolicitado){
            maximoVol=arr[i].totalSolicitado;
        }

    }

    arr = arr.sort((a, b) => b.Masivos*100 - a.Masivos*100);

    var altura=30;
    var caso=0;
   
    var svgTooltipHeight=(arr.length*altura)+50;

    if(svgTooltipHeight<80)
      svgTooltipHeight=80;

    if(svgTooltipHeight>windowHeight*.8)
      svgTooltipHeight=windowHeight*.8;

    var svgTooltipWidth=600;
    var marginLeft=svgTooltipWidth*.3;
    var tamanioFuente=altura*.5;
    if(tamanioFuente < 12)
    tamanioFuente=12;

    var marginTop=30;

    $("#toolTip2").css("visibility","visible");            
    $("#toolTip2").css("left",34+"%");
    $("#toolTip2").css("top",80+"px");

    //Agrega div con un elemento svg :

    // DATOS 

    var data = arr.map(function(item) {
        return {
          key: item.key,
          "MasivosVol": item.MasivosVol,      
          "totalSolicitado": item.totalSolicitado,
          "DifP": ((item.MasivosVol / item.totalSolicitado)) *100
        };
        });

    // DEFINE COLUMNAS
      
     var columns = [
        { key: "key", header: "Estado", sortable: true, width: "130px" },
        { key: "MasivosVol", header: "Volumen Masivos", sortable: true, width: "150px" },    
        { key: "totalSolicitado", header: "Vol. Solicitado", sortable: true, width: "150px" },
        { key: "DifP", header: "Procentaje", sortable: true, width: "150px" },
        ];

    // DEFINE VISITORS PARA CADA COLUMNA
    
    
      var columnVisitors = {
        key: function(value,i) {
            return `<div class="key-selector" onclick="backInfoNav.push({entity:'${entity.key}' , catlog:'${dataManager.getCurrentCatlog()}'});filterControls.arrowUpdate();filterControls.lookForEntity('${value}','cat_estado','${entity.key}')">${value}
            </div>`;
          },
    
        MasivosVol: function(value,i) {
                var ancho=GetValorRangos( value,1, maximo ,1,svgTooltipHeight*.4);
                var barValue = formatNumber(value);
               
              

                return '<div class="bar-container">' +
               
                '<span class="bar-value">' + barValue + '</span>' +
                '</div>';



                
        },
        
        totalSolicitado: function(value,i) {
                var ancho=GetValorRangos( value,1, maximoVol ,1,svgTooltipHeight*.4);
                var barValue = formatNumber(value);              
              

                return '<div class="bar-container">' +
              
                '<span class="bar-value">' + barValue + '</span>' +
                '</div>';



                
        }, 
        DifP: function(value,i) {
            var ancho=GetValorRangos( value,1, maximoVol ,1,svgTooltipHeight*.4);
            var barValue = formatNumber(value)+" %";              
          

            return '<div class="bar-container">' +
          
            '<span class="bar-value">' + barValue + '</span>' +
            '</div>';



            
    }
      };

      // COLUMNAS CON TOTALES :

      var columnsWithTotals = ['MasivosVol','totalSolicitado','DifP']; 
      var totalsColumnVisitors = {
                'MasivosVol': function(value) { 
                        var v = formatNumber(value);
             
                        return v; 
                },
                'totalSolicitado': function(value) { 
                        var v = formatNumber(value);
             
                        return v; 
                }
               
                };

    
    
      // FORMATEA DIV :

      vix_tt_formatToolTip("#toolTip2","Masivos por estado de "+dataManager.getNameFromId(entity.key)+" (TM)", 600, svgTooltipHeight+100,dataManager.GetTooltipInfoData("toolTip2","Masivos"));
    
     // CREA TABLA USANDO DATOS
      
     vix_tt_table_extended(data, columns, columnVisitors, totalsColumnVisitors, "toolTip2", columnsWithTotals );        

     // Crea una barra inferior y pasa una funcion de exportacion de datos
     vix_tt_formatBottomBar("#toolTip2", function () {
       var dataToExport = formatDataForExport(data, columns);
       var filename = "exported_data";
       exportToExcel(dataToExport, filename);
     });
      


     drawKpiExpert_VENTAS.sortRegistredWindows();

      // APLICA TRANSICIONES 
    
      vix_tt_transitionRectWidth("toolTip2");
      


}
    