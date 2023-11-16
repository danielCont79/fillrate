var kpiExpert_ABAS={};

kpiExpert_ABAS.eraseChart=function(){ 

    d3.select("#svgTooltip").selectAll(".abasDetail").data([]).exit().remove();
    d3.select("#svgTooltip3").selectAll(".abasDetail").data([]).exit().remove();
    d3.select("#svgTooltip4").selectAll(".abasDetail").data([]).exit().remove();
    d3.select("#svgTooltip5").selectAll(".abasDetail").data([]).exit().remove();
    d3.select("#svgTooltip6").selectAll(".abasDetail").data([]).exit().remove();
    
    $("#toolTip2").css("visibility","hidden");
    $("#toolTip3").css("visibility","hidden");
    $("#toolTip4").css("visibility","hidden");
    $("#toolTip5").css("visibility","hidden");
    $("#toolTip6").css("visibility","hidden");

}

kpiExpert_ABAS.lastEntity;

kpiExpert_ABAS.DrawTooltipDetail=function(entity,extraData){   

  kpiExpert_ABAS.lastEntity=entity;

    $("#toolTip").css("visibility","hidden");        
    
    d3.select("#svgTooltip").selectAll(".abasDetail").data([]).exit().remove();
    d3.select("#svgTooltip3").selectAll(".abasDetail").data([]).exit().remove();
    d3.select("#svgTooltip4").selectAll(".abasDetail").data([]).exit().remove();
    d3.select("#svgTooltip5").selectAll(".abasDetail").data([]).exit().remove();
    d3.select("#svgTooltip6").selectAll(".abasDetail").data([]).exit().remove();

    // VENTANA SE MUESTRA SI SE ESTA EN NIVEL DE UNIDAD DE NEGOCIO   
   
    if( 5 == $("#nivel_cb").val() ){
       kpiExpert_ABAS.DrawTooltipDetail_UNComoOrigen(entity,extraData); 
       kpiExpert_ABAS.DrawTooltipDetail_Origen(entity,extraData);  
    }else{
        kpiExpert_ABAS.DrawTooltipDetail_UN(entity,extraData);
    }    

    //kpiExpert_ABAS.DrawTooltipDetail_Origen(entity);    
    
    kpiExpert_ABAS.DrawTooltipDetail_Transporte(entity,extraData);
      

    opacidadCesium=30;
      $("#cesiumContainer").css("opacity",opacidadCesium/100);     

    // DISTRIBUYE
    if( 5 == $("#nivel_cb").val() ){
         vix_tt_distributeDivs(["#toolTip5","#toolTip4","#toolTip2"]);  
    } else {
         vix_tt_distributeDivs(["#toolTip3","#toolTip2"]);
    }

}


 //********************************************************************************************************************** */

kpiExpert_ABAS.DrawTooltipDetail_UNComoOrigen=function(entity,extraData){    

    var maximo=0;
    var maximoVolumen=0;

    var arrTemp=[];

    for(var i=0; i < store.abasto.length; i++ ){
        
        if(store.abasto[i].Origen==entity.key){
            console.log("insertaa");
            arrTemp.push(store.abasto[i]);
        }
            
    }

    if( 5 == $("#nivel_cb").val() ){

      for(var i=0; i < arrTemp.length; i++ ){
        arrTemp[i].DestinoTrans=arrTemp[i].Destino+"_"+arrTemp[i].Transporte;
       
      }

      var arr=d3.nest()
            .key(function(d) { return d.DestinoTrans; })
            .entries(arrTemp);

    }else{

      var arr=d3.nest()
            .key(function(d) { return d.Destino; })
            .entries(arrTemp); 

    }     

   
    for(var i=0; i < arr.length; i++ ){
        arr[i].Dif=0;
    
        arr[i].VolumenReal=0;
        arr[i].VolumenPlan=0;
        arr[i].PesoPlan=0;
        arr[i].PesoReal=0;
        arr[i].Peso=0;
    
        for(var j=0; j < arr[i].values.length; j++ ){
        
            arr[i].VolumenReal+=Number(arr[i].values[j].VolumenReal);
            arr[i].VolumenPlan+=Number(arr[i].values[j].VolumenPlan);
            arr[i].PesoPlan+=Number(arr[i].values[j].VolPlan_Peso);
            arr[i].PesoReal+=Number(arr[i].values[j].VolReal_Peso);
            arr[i].Peso+=Number(arr[i].values[j].Peso);

        }         

        arr[i].DifPer=0;
        arr[i].DifPesos=0;
        arr[i].Dif=0;

        if(arr[i].VolumenPlan>0){
            arr[i].Dif=arr[i].VolumenReal-arr[i].VolumenPlan;
            arr[i].DifPer=arr[i].VolumenReal/arr[i].VolumenPlan;
        }
        
        if(arr[i].PesoPlan>0){
          arr[i].DifPesos=arr[i].PesoReal-arr[i].PesoPlan;
        }
        
        if(maximo < arr[i].DifPesos*1000){
          maximo = arr[i].DifPesos*1000;
        }

        if(maximoVolumen < arr[i].DifPer*1000){
            maximoVolumen=arr[i].DifPer*1000;
        }

    } 

    arr = arr.sort((a, b) => b.Dif - a.Dif);    
    arr.reverse();

    var altura=30;
    var caso=0;

    var svgTooltipHeight=arr.length*altura*.55;

    if(svgTooltipHeight<140){
      console.log("corrigee");
      svgTooltipHeight=140;
    }
     

    if(svgTooltipHeight>windowHeight*.8){

      svgTooltipHeight=windowHeight*.8;
     
    }    

    var svgTooltipWidth=600;
    var marginLeft=svgTooltipWidth*.2;
    var tamanioFuente=altura*.4;
    var marginTop=35;
    
    $("#toolTip5").css("visibility","visible");            
    $("#toolTip4").css("top",70+"px");
    $("#toolTip4").css("bottom","");
    $("#toolTip5").css("right","2%");

    if(windowWidth > 1500 ){

      $("#toolTip5").css("top",90+"px");
      $("#toolTip5").css("right","2%");
     
    }

    // DATOS 

    var data = arr.map(function(item) {
        return {
          key: item.key,
          "VolumenPlan": item.VolumenPlan,
          "VolumenReal": item.VolumenReal,
          "DifK": item.VolumenReal - item.VolumenPlan,
          "DifP":  ((item.VolumenReal / item.VolumenPlan) ) * 100,
          "PesoPlan": item.PesoPlan,
          "PesoReal": item.PesoReal,
          "DifPesos": item.DifPesos
        };
        });   
    
        // DEFINE COLUMNAS
      
     
      if(extraData){

        var svgTooltipWidth=840;

        var columns = [
          { key: "key", header: "Destino", sortable: true, width: "110px" },
          { key: "PesoPlan", header: "Peso Plan", sortable: true,  width: "100px" },
          { key: "PesoReal", header: "Peso Real", sortable: true,  width: "100px" },
          { key: "DifPesos", header: "Dif", sortable: true,  width: "100px" },
          { key: "DifP", header: "Cumplimiento (%)", sortable: true,  width: "120px" },
          { key: "VolumenPlan", header: "Vol Plan", sortable: true, width: "100px" },
          { key: "VolumenReal", header: "Vol Real", sortable: true, width: "100px" },
          { key: "DifK", header: "Dif", sortable: true, width: "100px" },
          
         
        ];
  

      }else{

        var svgTooltipWidth=500;
        
        var columns = [
          { key: "key", header: "Destino", sortable: true, width: "110px" },         
          { key: "PesoPlan", header: "Peso Plan", sortable: true,  width: "100px" },
          { key: "PesoReal", header: "Peso Real", sortable: true,  width: "100px" },
          { key: "DifPesos", header: "Dif", sortable: true,  width: "100px" },
          { key: "DifP", header: "Cumplimiento (%)", sortable: true,  width: "120px" }

        ];

        
      }
    
    
       // DEFINE VISITORS PARA CADA COLUMNA
    
    
      var columnVisitors = {
        key: function(value) {
          value=value.replaceAll("_"," ");
            return `<div>${value}
            </div>`;
          },
    
        VolumenPlan: function(value) {
          return vix_tt_formatNumber(value) ;
        },
        VolumenReal: function(value) {
            return vix_tt_formatNumber(value) ;
        },
        DifK: function(value) {
            return vix_tt_formatNumber(value) ;
        },
        DifP: function(value){
          
          if(value<0)
          value=0;

          if(value > 150 && value!=Infinity)
            value=150;          

          if(value!=Infinity){
            var barWidth = value*.66 + '%';
            var barValue = vix_tt_formatNumber(value)+'%   ';
          }else{
            var barWidth =  '0%';
            var barValue = vix_tt_formatNumber(0)+'%   ';
          }            
        
          return '<div class="bar-container">' +
            '<span class="bar-value">' + barValue + '</span>' + '<svg width="90%" height="10">'  
            + '<rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: white;"></rect></svg>' +        
            '</div>';
        },
        PesoPlan: function(value) {
        
          return '<div style="padding-left:10px;">' +vix_tt_formatNumber(value)+'</div>';   ;
        },
        PesoReal: function(value) {
          return vix_tt_formatNumber(value) ;
        },
        DifPesos: function(value) {
          return vix_tt_formatNumber(value) ;
        }
      };
    
    
      // FORMATEA DIV :

      vix_tt_formatToolTip("#toolTip5","Abasto desde "+dataManager.getNameFromId(entity.key)+" hacia otras UN (TM)",svgTooltipWidth,svgTooltipHeight+80,dataManager.GetTooltipInfoData("toolTip5","Abasto"),"kpiExpert_ABAS.DrawTooltipDetail_UNComoOrigen(kpiExpert_ABAS.lastEntity,true)");

      // COLUMNAS CON TOTALES :

      var columnsWithTotals = ['VolumenPlan','VolumenReal','DifK','PesoPlan','PesoReal','DifPesos']; 
      var totalsColumnVisitors = {
                'VolumenPlan': function(value) { 
                  return vix_tt_formatNumber(value) + " TM";
                },
                'VolumenReal': function(value) { 
                  return vix_tt_formatNumber(value) + " TM"; 
                },
                'DifK': function(value) { 
                  return vix_tt_formatNumber(value) + " TM"; 
                },
                'PesoPlan': function(value) { 
                  return vix_tt_formatNumber(value) + " TM"; 
                },
                'PesoReal': function(value) { 
                  return vix_tt_formatNumber(value) + " TM"; 
                },
                'DifPesos': function(value) { 
                  return vix_tt_formatNumber(value) + " TM"; 
                }
                };      
   
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
      
    
}


 //********************************************************************************************************************** */
    
kpiExpert_ABAS.DrawTooltipDetail_Transporte=function(entity,extraData){    
   
    var maximo=0;
    var maximoVolumen=0;   
   
    var arr=d3.nest()
            .key(function(d) { return d.Transporte; })
            .entries(entity.abasto.values);         
    
    for(var i=0; i < arr.length; i++ ){
        arr[i].Dif=0;
      
        arr[i].VolumenReal=0;
        arr[i].VolumenPlan=0; 
        arr[i].PesoPlan=0;
        arr[i].PesoReal=0;
        arr[i].Peso=0;      

        for(var j=0; j < arr[i].values.length; j++ ){
        
            arr[i].VolumenReal+=Number(arr[i].values[j].VolumenReal);
            arr[i].VolumenPlan+=Number(arr[i].values[j].VolumenPlan); 
            arr[i].PesoPlan+=Number(arr[i].values[j].VolPlan_Peso);
            arr[i].PesoReal+=Number(arr[i].values[j].VolReal_Peso);
            arr[i].Peso+=Number(arr[i].values[j].Peso);        

        }

        arr[i].DifPer=0;
        arr[i].DifPesos=0;
        arr[i].Dif=0;
        
        if(arr[i].VolumenReal>0){
            arr[i].Dif=arr[i].VolumenReal-arr[i].VolumenPlan;
            arr[i].DifPer=arr[i].VolumenReal/arr[i].VolumenPlan;
        }

        if(arr[i].PesoPlan>0){
          arr[i].DifPesos=arr[i].PesoReal-arr[i].PesoPlan;
        }
        
        if(maximo < arr[i].DifPesos*1000){
          maximo = arr[i].DifPesos*1000;
        }

        if(maximoVolumen < arr[i].DifPer*1000){
            maximoVolumen=arr[i].DifPer*1000;
        }

    } 
    
    arr = arr.sort((a, b) => b.Dif - a.Dif);    
    arr.reverse();

    var altura=30;
    var caso=0;
   
    var svgTooltipHeight=arr.length*(altura*.55);


    if(svgTooltipHeight<80)
     svgTooltipHeight=80;

    var svgTooltipWidth=500;
    var marginLeft=svgTooltipWidth*.15;
    var tamanioFuente=altura*.4;
    var marginTop=35;


    $("#toolTip2").css("visibility","visible");  
    $("#toolTip2").css("inset","");            
    $("#toolTip2").css("bottom","1%");
    $("#toolTip2").css("right","100px");

    if(windowWidth > 1500 ){

      $("#toolTip2").css("top",windowHeight*.5+"px");
      //$("#toolTip2").css("left",windowWidth*.6+"px");
      $("#toolTip2").css("right","10px");
     
    }

    // DATOS 

    var data = arr.map(function(item) {
        return {
          key: item.key,
          "VolumenPlan": item.VolumenPlan,
          "VolumenReal": item.VolumenReal,
          "DifK": item.VolumenReal - item.VolumenPlan,
          "DifP":  ((item.VolumenReal / item.VolumenPlan) ) * 100,
          "PesoPlan": item.PesoPlan,
          "PesoReal": item.PesoReal,
          "DifPesos": item.DifPesos
        };
        });  
    
      
    
      // DEFINE COLUMNAS
      if(extraData){

        var svgTooltipWidth=840;

        var columns = [

          { key: "key", header: "Transporte", sortable: true, width: "110px" },
          { key: "PesoPlan", header: "Peso Plan ", sortable: true,  width: "100px" },
          { key: "PesoReal", header: "Peso Real ", sortable: true,  width: "100px" },
          { key: "DifPesos", header: "Dif ", sortable: true,  width: "100px" },        
          { key: "DifP", header: "Cumplimiento (%)", sortable: true,  width: "120px" },  
          { key: "VolumenPlan", header: "Vol Plan ", sortable: true, width: "100px" },
          { key: "VolumenReal", header: "Vol Real ", sortable: true, width: "100px" },
          { key: "DifK", header: "Dif ", sortable: true, width: "100px" },
         

        ];

      }else{

        var svgTooltipWidth=500;
        
        var columns = [
          { key: "key", header: "Transporte", sortable: true, width: "110px" },
          { key: "PesoPlan", header: "Peso Plan ", sortable: true,  width: "100px" },
          { key: "PesoReal", header: "Peso Real ", sortable: true,  width: "100px" },
          { key: "DifPesos", header: "Dif ", sortable: true,  width: "100px" },
          { key: "DifP", header: "Cumplimiento (%)", sortable: true,  width: "120px" }
        ];
      }
    
    
       // DEFINE VISITORS PARA CADA COLUMNA
    
    
      var columnVisitors = {
        key: function(value) {
            return `<div>${value}
            </div>`;
          },
    
        VolumenPlan: function(value) {
          return vix_tt_formatNumber(value) ;
        },
        VolumenReal: function(value) {
            return vix_tt_formatNumber(value) ;
        },
        DifK: function(value) {
            return vix_tt_formatNumber(value) ;
        },
        DifP: function(value){

            if(value<0)
            value=0;

            if(value > 150 && value!=Infinity)
              value=150;
          
            if(value!=Infinity){
              var barWidth = value*.66 + '%';
              var barValue = vix_tt_formatNumber(value)+'%   ';
            }else{
              var barWidth =  '0%';
              var barValue = vix_tt_formatNumber(0)+'%   ';
            }  
        
            return '<div class="bar-container">' +
           
            '<span class="bar-value" style="width:60px">'  + barValue + '</span>' + '<svg width="90%" height="10">'  
            + '<rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: white;"></rect></svg>' +        
            '</div>';
        },
        PesoPlan: function(value) {
        
          return '<div style="padding-left:10px;">' +vix_tt_formatNumber(value)+'</div>';   ;
        },
        PesoReal: function(value) {
          return vix_tt_formatNumber(value) ;
        },
        DifPesos: function(value) {
          return vix_tt_formatNumber(value) ;
        }
      };    
    
      // FORMATEA DIV :
    
      vix_tt_formatToolTip("#toolTip2","Abasto por Tipo de Transporte (TM)",svgTooltipWidth,svgTooltipHeight+120,dataManager.GetTooltipInfoData("toolTip2","Abasto"),"kpiExpert_ABAS.DrawTooltipDetail_Transporte(kpiExpert_ABAS.lastEntity,true)");


      $("#toolTip2").mousedown();
    
      
      // COLUMNAS CON TOTALES :

      var columnsWithTotals = ['VolumenPlan','VolumenReal','DifK','PesoPlan','PesoReal','DifPesos']; 
      var totalsColumnVisitors = {
                'VolumenPlan': function(value) { 
                  return vix_tt_formatNumber(value) ;
                },
                'VolumenReal': function(value) { 
                  return vix_tt_formatNumber(value) ; 
                },
                'DifK': function(value) { 
                  return vix_tt_formatNumber(value) ; 
                },
                'PesoPlan': function(value) { 
                  return vix_tt_formatNumber(value) ; 
                },
                'PesoReal': function(value) { 
                  return vix_tt_formatNumber(value) ; 
                },
                'DifPesos': function(value) { 
                  return vix_tt_formatNumber(value) ; 
                }

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


  // Detalle por dia de unidad de negocio
  kpiExpert_ABAS.DrawTooltipDetail_ByDay=function(entity, origen, transporte){  

    console.log(entity, origen, transporte);

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
        for(var i=0; i < store.catlogsForFilters.length; i++){    
            if(store.catlogsForFilters[i].data==nombreCatalogoParaDiccionario){
                diccionarioNombres=store.catlogsForFilters[i].diccNames;
                
            }
        } 

        for(var i=0; i < store.apiDataSources.length; i++){
          
            if(store.apiDataSources[i].varName=="abastoDetalle"){
              
                serviceName=store.apiDataSources[i].serviceName;
                apiURL=store.apiDataSources[i].apiURL;
            }

        }

        if(serviceName && apiURL){

                var dateInit_=dateInit.getFullYear()+"-"+String(Number(dateInit.getMonth())+1)+"-"+dateInit.getDate();
                var dateEnd_=dateEnd.getFullYear()+"-"+String(Number(dateEnd.getMonth())+1)+"-"+dateEnd.getDate();


                // FILTROS ****
                var params="";
              
                for(var j=0; j < store.catlogsForFilters.length; j++){ 
    
                    if($("#"+store.catlogsForFilters[j].id).val() != "" && $("#"+store.catlogsForFilters[j].id).val() != undefined  && $("#"+store.catlogsForFilters[j].id).val() != "Todos" ){
    
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

                params+="&destino="+entity;  
                
                if(origen)
                params+="&origen="+origen;

                if(transporte)
                params+="&transporte="+transporte;

                var URL=apiURL+"/"+serviceName+"?fechaInicio="+dateInit_+"&fechaFin="+dateEnd_+"&agrupador="+agrupador+""+params;
                console.log(URL);

                if(URL.indexOf("undefined" < 0)){

                    dataLoader.AddLoadingTitle("Detalle de abasto");

                    d3.json(URL, function (error, data) {

                          dataLoader.DeleteLoadingTitle("Detalle de abasto"); 

                          dataLoader.HideLoadings();

                          $("#cargando").css("visibility","hidden");

                          if(error){
                            alert("Error API Detalle Abasto",error);
                            resolve();
                            return;
                          }

                          if(data.error){
                              alert("Error API Detalle Abasto",data.error);
                              resolve();
                              return;
                          }

                          console.log("Detalle Abasto",data.recordset); 

                          //FECHAS *******

                          var maxDate=0;

                          for(var j=0;  j < data.recordset.length; j++){

                                if(data.recordset[j].dtFecha!=""){

                                      if( data.recordset[j].dtFecha.indexOf("T") > -1){
                    
                                              var fechaSplit=data.recordset[j].dtFecha.split("T");
                                              
                                              fechaSplit=fechaSplit[0].split("-");                   
                      
                                      }else{
                                              
                                              var fechaSplit=data.recordset[j].dtFecha.split("-");
                        
                                      }  
                                      
                                      data.recordset[j].fecha= new Date(Number(fechaSplit[0]),Number(fechaSplit[1])-1 ,Number(fechaSplit[2])); 

                                      if(maxDate < data.recordset[j].fecha.getTime())
                                           maxDate = data.recordset[j].fecha.getTime();
                                }

                          }

                      // VALIDA DIAS FALTANTES *****

                      var diasDelPeriodo={};
                      var data_=[];

                      for(var i=0; i < data.recordset.length; i++ ){

                            if(data.recordset[i].fecha){
                                  
                                    diasDelPeriodo[ data.recordset[i].fecha.getTime() ]=true;
                                    data_.push(data.recordset[i]);

                            }

                      }

                      var dia=((1000*60)*60)*24;
                      var init=dateInit.getTime();
                      var end=dateEnd.getTime();

                      for(var i=init; i < end+1000; i+=((1000*60)*60)*24 ){

                            if(!diasDelPeriodo[new Date(i).getTime()]){

                              var obj={};

                              obj.AgrupProducto="";
                              obj.DescrProducto="";
                              obj.Destino="";
                              obj.GerenciaDestinoUN="";
                              obj.GerenciaOrigenUN="";
                              obj.Origen="";
                              obj.Presentacion="";
                              obj.RegionDestinoUN="";
                              obj.RegionOrigenUN="";
                              obj.RowAbasto="";
                              obj.Transporte="";
                              obj.VolumenPlan=0;
                              obj.VolumenReal=0;

                              obj.dtFecha=String(new Date(i)),
                              obj.fecha=new Date(i);
                              data_.push(obj);

                            }

                      }

                      data.recordset=data_;

                      var arr=d3.nest()
                          .key(function(d) { 

                                  if(d.fecha){
                                          return d.fecha.getTime(); 
                                  }else{                       
                                          return 0;
                                  }                        
                  
                          })
                          .entries(data.recordset);

                      arr = arr.sort((a, b) => {  

                        return b.key - a.key; 

                      });

                      arr=arr.reverse();

                      console.log(arr);

                      var maximo=0;    
                      var maximoVolumen=0;

                      for(var i=0; i < arr.length; i++ ){

                                arr[i].Dif=0;
                                arr[i].DifPer=0;
        
                                arr[i].VolumenReal=0;
                                arr[i].VolumenPlan=0;                                   

                                for(var j=0; j < arr[i].values.length; j++ ){

                                  arr[i].VolumenReal+=Number(arr[i].values[j].VolumenReal);
                                  arr[i].VolumenPlan+=Number(arr[i].values[j].VolumenPlan);                                    

                                }

                                if(arr[i].VolumenPlan>0){
                                  arr[i].Dif=arr[i].VolumenReal-arr[i].VolumenPlan;
                                  arr[i].DifPer=arr[i].VolumenReal/arr[i].VolumenPlan;
                              } 

                              if(maximo < arr[i].VolumenReal){
                                maximo=arr[i].VolumenReal;
                              }

                              if(maximoVolumen < arr[i].DifPer*1000){
                                maximoVolumen=arr[i].DifPer*1000;
                              }                          

                      }

                      var ancho=18;

                      var svgTooltipWidth=arr.length*(ancho*1.05) ;

                      if(svgTooltipWidth < 300)
                        svgTooltipWidth=300;

                      var svgTooltipHeight=400;

                      var tamanioFuente=ancho*.8;
                      
                      $("#toolTip6").css("visibility","visible");  
                      $("#toolTip6").css("inset",""); 
                      
                      vix_tt_formatToolTip("#toolTip6","Abasto por Día de Destino "+entity+" (TM)",svgTooltipWidth+7,svgTooltipHeight+100);               

                      var marginBottom=svgTooltipHeight*.02;

                      var svgElement = "<svg id='svgTooltip6' style='pointer-events:none;'></svg>";
                      d3.select("#toolTip6").append("div").html(svgElement);
                  
                      d3.select("#svgTooltip6")                     
                          .style("width", svgTooltipWidth )
                          .style("height", (svgTooltipHeight)+50 )                
                        ;

                      //DIBUJA BARRAS

                      var lastPosY;

                      var caso=0;

                      for(var i=0; i < arr.length; i++ ){ 

                              var altura=(svgTooltipHeight*.4);

                              if(arr[i].VolumenReal==0 && arr[i].VolumenPlan==0){

                                    var altura1=1;
                                    var altura2=1;
                                    
                              }else{
          
                                    var altura1=GetValorRangos( arr[i].VolumenReal,1, maximo ,1,altura);
                                    var altura2=GetValorRangos( arr[i].VolumenPlan,1, maximo ,1,altura);
          
                              }   

                              console.log(arr[i].VolumenReal,arr[i].VolumenPlan);
                              
                              d3.select("#svgTooltip6").append("rect")		    		
                                        .attr("width",function(d){                                      
                                          return ancho*.9;
                                        })
                                        .attr("class","abastoDetail")
                                        .style("pointer-events","auto")
                                        .attr("x",(ancho*caso)  )
                                        .attr("y", ((svgTooltipHeight*.9))-altura1-80  )
                                        .attr("height",1)
                                        .attr("fill","#0068E9")
                                        .transition().delay(0).duration(i*50)
                                        .attr("height",altura1 );

                              if(lastPosY){

                                      d3.select("#svgTooltip6").append("line")       
                                                    .attr("class","ventasDetail")                                
                                                    .attr("x1",lastPosY.x+(ancho/2) )
                                                    .attr("y1", lastPosY.y   )
                                                    .attr("x2",ancho*caso+(ancho/2) )
                                                    .attr("y2", ((svgTooltipHeight*.9))-altura2-80  )
                                                    .style("stroke","#ffffff")
                                                    .style("stroke-width",2)
                                                    .style("stroke-opacity",1);
          
                              }
          
                              lastPosY={x:(ancho*caso) ,y:((svgTooltipHeight*.9))-altura2-80 };


                              d3.select("#svgTooltip6")
                                    .append("text")						
                                    .attr("class","ventasDetail")
                                    .style("fill","#ffffff")		
                                    .style("font-family","Cabin")
                                    .style("font-weight","bold")
                                    .style("font-size",tamanioFuente*.8)						
                                    .style("text-anchor","start")
                                    .style("opacity",0 )
                                    .attr("transform"," translate("+String( ancho*caso+(tamanioFuente*.7)+1  )+","+String( ((svgTooltipHeight*.25))-10 )+")  rotate("+(-90)+") ")
                                    .text(function(){
                                      
                                      var porDif="0";

                                      if(arr[i].VolumenPlan>0){

                                        porDif = Math.round((arr[i].VolumenReal/arr[i].VolumenPlan)*100);

                                      }

                                      if(arr[i].VolumenPlan == 0){
                                        return "";
                                      }

                                    return  "R: "+formatNumber(arr[i].VolumenReal)+" -  "+ porDif +"%";

                                    })
                                    .transition().delay(0).duration(i*50)
                                    .style("opacity",1 );

                              d3.select("#svgTooltip6")
                                    .append("text")						
                                    .attr("class","ventasDetail")
                                    .style("fill","#ffffff")		
                                    .style("font-family","Cabin")
                                    .style("font-weight","bold")
                                    .style("font-size",tamanioFuente*.8)	
                                    .style("text-anchor","end")
                                    .attr("transform"," translate("+String( ancho*caso+(tamanioFuente*.7)  )+","+String( (svgTooltipHeight*.9)-74  )+")  rotate("+(-90)+") ")
                                    .text(function(){

                                      return  arr[i].values[0].fecha.getDate()+" "+getMes(arr[i].values[0].fecha.getMonth());

                                    });


                                    caso++; 

                      }
                        
                      // DISTRIBUYE 
                      vix_tt_distributeDivs(["#toolTip3","#toolTip2","#toolTip6"]);  

                    });

                };
        }

  }


 //********************************************************************************************************************** */

  kpiExpert_ABAS.DrawTooltipDetail_UN=function(entity,extraData){  

        var maximo=0;    
        var maximoVolumen=0;   
    
        var arr=d3.nest()
                .key(function(d) { return d.Destino; })
                .entries(entity.abasto.values);

        
        for(var i=0; i < arr.length; i++ ){
            arr[i].Dif=0;
        
            arr[i].VolumenReal=0;
            arr[i].VolumenPlan=0;
            arr[i].PesoPlan=0;
            arr[i].PesoReal=0;
            arr[i].Peso=0;
        
            for(var j=0; j < arr[i].values.length; j++ ){
            
                arr[i].VolumenReal+=Number(arr[i].values[j].VolumenReal);
                arr[i].VolumenPlan+=Number(arr[i].values[j].VolumenPlan);
                arr[i].PesoPlan+=Number(arr[i].values[j].VolPlan_Peso);
                arr[i].PesoReal+=Number(arr[i].values[j].VolReal_Peso);
                arr[i].Peso+=Number(arr[i].values[j].Peso);

            }                 
           

            arr[i].DifPer=0;
            arr[i].DifPesos=0;
            arr[i].Dif=0;

            if(arr[i].PesoPlan>0){
              arr[i].DifPesos=arr[i].PesoReal-arr[i].PesoPlan;
            }

            if(arr[i].VolumenPlan>0){
                arr[i].Dif=arr[i].VolumenReal-arr[i].VolumenPlan;
                arr[i].DifPer=arr[i].VolumenReal/arr[i].VolumenPlan;
            } 
            
            if(maximo < arr[i].DifPesos*1000){
                maximo = arr[i].DifPesos*1000;
            }

            if(maximoVolumen < arr[i].DifPer*1000){
                maximoVolumen=arr[i].DifPer*1000;
            }

        } 
        
        arr = arr.sort((a, b) => b.Dif - a.Dif);    
        arr.reverse();

        var altura=50;
        var caso=0;
    
        var svgTooltipHeight=arr.length*(altura*.55);

        if(svgTooltipHeight<120)
            svgTooltipHeight=120;

        if(svgTooltipHeight>windowHeight*.61)
            svgTooltipHeight=windowHeight*.61;



        var svgTooltipWidth=660;
        var marginLeft=svgTooltipWidth*.2;
        var tamanioFuente=altura*.4;
        var marginTop=35;

        $("#toolTip3").css("visibility","visible");            
        $("#toolTip3").css("left",radio*.5+"px");
        $("#toolTip3").css("top",70+"px");
        $("#toolTip3").css("max-height","");

        if(windowWidth > 1500 ){

          $("#toolTip3").css("top",80+"px");
          $("#toolTip3").css("left",radio+"px");
         
        }


    // DATOS 

    var data = arr.map(function(item) {
        return {
          icon_day:item.key,
          icon_plus:item.key,
          key: item.key,
          "VolumenPlan": item.VolumenPlan,
          "VolumenReal": item.VolumenReal,
          "DifK": item.VolumenReal - item.VolumenPlan,
          "DifP":  item.DifPer * 100,
          "PesoPlan": item.PesoPlan,
          "PesoReal": item.PesoReal,
          "DifPesos": item.DifPesos,
        };
        });  
         

    
        // DEFINE COLUMNAS


      if(extraData){

        var svgTooltipWidth=930;

        var columns = [

          { key: "icon_day", header: "", sortable: false, width: "50px" },
          { key: "icon_plus", header: "", sortable: false, width: "50px" },
          { key: "key", header: "Unidad de Negocio", sortable: true, width: "140px" },
          { key: "PesoPlan", header: "Peso Plan ", sortable: true,  width: "100px" },
          { key: "PesoReal", header: "Peso Real ", sortable: true,  width: "100px" },
          { key: "DifPesos", header: "Dif ", sortable: true,  width: "100px" },
          { key: "DifP", header: "Cumplimiento (%)", sortable: true,  width: "120px" },
          { key: "VolumenPlan", header: "Vol Plan ", sortable: true, width: "100px" },
          { key: "VolumenReal", header: "Vol Real", sortable: true, width: "100px" },
          { key: "DifK", header: "Dif ", sortable: true, width: "100px" },
          
          
        ];

      }else{

        var svgTooltipWidth=580;
        
        var columns = [
          { key: "icon_day", header: "", sortable: false, width: "50px" },
          { key: "icon_plus", header: "", sortable: false, width: "50px" },
          { key: "key", header: "Unidad de Negocio", sortable: true, width: "140px" },          
          { key: "PesoPlan", header: "Peso Plan ", sortable: true,  width: "100px" },
          { key: "PesoReal", header: "Peso Real ", sortable: true,  width: "100px" },
          { key: "DifPesos", header: "Dif ", sortable: true,  width: "100px" },
          { key: "DifP", header: "Cumplimiento (%)", sortable: true,  width: "120px" }
        ];

      }
    
    
    
      // DEFINE VISITORS PARA CADA COLUMNA   
    
      var columnVisitors = {
        icon_day: function(value) {
          return `<img src="images/days.png" style="width:22px;heght:22px; " onclick="  kpiExpert_ABAS.DrawTooltipDetail_ByDay('${value}')">
          </img>`;
        },
        icon_plus: function(value) {
          return `<img src="images/plus_icon2.png" style="width:16px;heght:16px; " onclick="console.log('${value}')">
          </img>`;
        },
        key: function(value) {
            return `<div class="key-selector" onclick="backInfoNav.push({entity:'${entity.key}' , catlog:'${dataManager.getCurrentCatlog()}'});filterControls.arrowUpdate();filterControls.lookForEntity('${value}','cat_un','${entity.key}')">${value}
            </div>`;
          },
    
        VolumenPlan: function(value) {
          return vix_tt_formatNumber(value) ;
        },
        VolumenReal: function(value) {
            return vix_tt_formatNumber(value) ;
        },
        DifK: function(value) {
            return vix_tt_formatNumber(value) ;
        },
        DifP: function(value){
          
          if(value<0)
            value=0;

          if(value > 150 && value!=Infinity)
            value=150;

          value=Math.round(value);

          var barWidth = value*.66 + '%';
          var barValue = vix_tt_formatNumber(value)+'%   ';

            //var fixedWidth = '60px';

          return '<div class="bar-container">' +
            '<span class="bar-value">' + barValue + '</span>' +
            '<svg width="90%" height="10">'  +
            '<rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: white;"></rect></svg>' +        
            '</div>';        

      
        },
        PesoPlan: function(value) {
        
          return '<div style="padding-left:10px;">' +vix_tt_formatNumber(value)+'</div>';   ;
        },
        PesoReal: function(value) {
          return vix_tt_formatNumber(value) ;
        },
        DifPesos: function(value) {
          return vix_tt_formatNumber(value) ;
        }
      };    
    
      // COLUMNAS CON TOTALES :

      var columnsWithTotals = ['VolumenPlan','VolumenReal','DifK','PesoPlan','PesoReal','DifPesos']; 
      var totalsColumnVisitors = {
                'VolumenPlan': function(value) { 
                  return vix_tt_formatNumber(value) ;
                },
                'VolumenReal': function(value) { 
                  return vix_tt_formatNumber(value) ; 
                },
                'DifK': function(value) { 
                  return vix_tt_formatNumber(value) ; 
                },
                'PesoPlan': function(value) { 
                  return vix_tt_formatNumber(value) ; 
                },
                'PesoReal': function(value) { 
                  return vix_tt_formatNumber(value) ; 
                },
                'DifPesos': function(value) { 
                  return vix_tt_formatNumber(value) ; 
                }
                };
 


      vix_tt_formatToolTip("#toolTip3","Abasto recibido en UN que atienden "+dataManager.getNameFromId(entity.key)+" (TM)" ,svgTooltipWidth,svgTooltipHeight+130,dataManager.GetTooltipInfoData("toolTip3","Abasto"),"kpiExpert_ABAS.DrawTooltipDetail_UN(kpiExpert_ABAS.lastEntity,true)");

      vix_tt_table_extended(data, columns, columnVisitors, totalsColumnVisitors, "toolTip3", columnsWithTotals );  

      // Crea una barra inferior y pasa una funcion de exportacion de datos
      vix_tt_formatBottomBar("#toolTip3", function () {
        var dataToExport = formatDataForExport(data, columns);
        var filename = "exported_data";
        exportToExcel(dataToExport, filename);
      });

      // APLICA TRANSICIONES 
    
      vix_tt_transitionRectWidth("toolTip3");
      
 }

 //********************************************************************************************************************** */

kpiExpert_ABAS.DrawTooltipDetail_Origen=function(entity,extraData){  

  console.log("entity",entity);

        var maximo=0;    
        var maximoVolumen=0;  
        
        if( 5 == $("#nivel_cb").val() ){

          for(var i=0; i < entity.abasto.values.length; i++ ){
              entity.abasto.values[i].OrigenTrans=entity.abasto.values[i].Origen+"_"+entity.abasto.values[i].Transporte;
           
          }
          var arr=d3.nest()
                .key(function(d) { return d.OrigenTrans; })
                .entries(entity.abasto.values);

        }else{
          var arr=d3.nest()
                .key(function(d) { return d.Origen; })
                .entries(entity.abasto.values);
        }  
        
        for(var i=0; i < arr.length; i++ ){

            arr[i].Dif=0;
            
            arr[i].VolumenReal=0;
            arr[i].VolumenPlan=0;
            arr[i].PesoPlan=0;
            arr[i].PesoReal=0;
            arr[i].Peso=0;    
           
            for(var j=0; j < arr[i].values.length; j++ ){
            
                arr[i].VolumenReal+=Number(arr[i].values[j].VolumenReal);
                arr[i].VolumenPlan+=Number(arr[i].values[j].VolumenPlan);   
                arr[i].PesoPlan+=Number(arr[i].values[j].VolPlan_Peso);
                arr[i].PesoReal+=Number(arr[i].values[j].VolReal_Peso);
                arr[i].Peso+=Number(arr[i].values[j].Peso);               
                
            }

            arr[i].DifPer=0;
            arr[i].DifPesos=0;
            arr[i].Dif=0;
          
            if(arr[i].VolumenPlan>0){
                arr[i].Dif=arr[i].VolumenReal-arr[i].VolumenPlan;
                arr[i].DifPer=arr[i].VolumenReal/arr[i].VolumenPlan;
            } 

            if(arr[i].PesoPlan>0){
              arr[i].DifPesos=arr[i].PesoReal-arr[i].PesoPlan;
            }
            
            if(maximo < arr[i].DifPesos*1000){
              maximo = arr[i].DifPesos*1000;
            }    

            if(maximoVolumen < arr[i].DifPer*1000){
                maximoVolumen=arr[i].DifPer*1000;
            }     

        } 
        
        arr = arr.sort((a, b) => b.Dif - a.Dif);    
        arr.reverse();

        var altura=32;
        var caso=0;
    
        var svgTooltipHeight=arr.length*altura;

        if(svgTooltipHeight<180)
          svgTooltipHeight=180;

        if(svgTooltipHeight>windowHeight*.7)
            svgTooltipHeight=windowHeight*.7;


        
        var marginLeft=svgTooltipWidth*.2;
        var tamanioFuente=altura*.4;
        var marginTop=35;

        $("#toolTip4").css("inset","");   
        $("#toolTip4").css("visibility","visible");  
        
        $("#toolTip4").append("<svg id='svgTooltip4'  style='pointer-events:none; line-heigth:22px;'></svg> ");
    

    // DATOS 

    var data = arr.map(function(item) {
        return {
          icon_day:item.key,
          icon_plus:item.key,
          key: item.key,
          "VolumenPlan": item.VolumenPlan,
          "VolumenReal": item.VolumenReal,
          "DifK": item.VolumenReal - item.VolumenPlan,
          "DifP":  item.DifPer * 100,
          "PesoPlan": item.PesoPlan,
          "PesoReal": item.PesoReal,
          "DifPesos": item.DifPesos
        };
        });     
 
        // DEFINE COLUMNAS
      
      if(extraData){

        var svgTooltipWidth=1000;

        var columns = [
          { key: "icon_day", header: "", sortable: false, width: "50px" },
          { key: "icon_plus", header: "", sortable: false, width: "50px" },
          { key: "key", header: "Origen", sortable: true, width: "140px" },
          { key: "PesoPlan", header: "Peso Plan", sortable: true,  width: "100px" },
          { key: "PesoReal", header: "Peso Real ", sortable: true,  width: "100px" },
          { key: "DifPesos", header: "Dif ", sortable: true,  width: "130px" },
          { key: "DifP", header: "Cumplimiento (%)", sortable: true,  width: "150px" },
          { key: "VolumenPlan", header: "Vol Plan ", sortable: true, width: "100px" },
          { key: "VolumenReal", header: "Vol Real ", sortable: true, width: "100px" },
          { key: "DifK", header: "Dif ", sortable: true, width: "100px" },
        
        ];

      }else{

        var svgTooltipWidth=600;
        
        var columns = [
          { key: "icon_day", header: "", sortable: false, width: "50px" },
          { key: "icon_plus", header: "", sortable: false, width: "50px" },
          { key: "key", header: "Origen", sortable: true, width: "140px" },        
          { key: "PesoPlan", header: "Peso Plan", sortable: true,  width: "100px" },
          { key: "PesoReal", header: "Peso Real ", sortable: true,  width: "100px" },
          { key: "DifPesos", header: "Dif ", sortable: true,  width: "130px" },
          { key: "DifP", header: "Cumplimiento (%)", sortable: true,  width: "150px" }
        ];

      }
    
        // DEFINE VISITORS PARA CADA COLUMNA
    
        var columnVisitors = {
        icon_day: function(value) {
          console.log("value",value);
          var nombreEntidad=value.split("_");
              nombreEntidad_=nombreEntidad[0];
          return `<img src="images/days.png" style="width:22px;heght:22px; " onclick="  kpiExpert_ABAS.DrawTooltipDetail_ByDay('${nombreEntidad_}','${entity.key}','${nombreEntidad[1]}')">
          </img>`;

        },
        icon_plus: function(value) {
          return `<img src="images/plus_icon2.png" style="width:16px;heght:16px; " onclick="console.log('${value}')">
          </img>`;
        },
          key: function(value) {

              var nombreEntidad=value.split("_");
              nombreEntidad=nombreEntidad[0];

              value=value.replaceAll("_"," ");
              return `<div class="key-selector" onclick="backInfoNav.push({entity:'${entity.key}' , catlog:'${dataManager.getCurrentCatlog()}'});filterControls.arrowUpdate();filterControls.lookForEntity('${nombreEntidad}','cat_un','${entity.key}')">${value}
              </div>`;
            },    
        VolumenPlan: function(value) {
          return vix_tt_formatNumber(value) ;
        },
        VolumenReal: function(value) {
            return vix_tt_formatNumber(value) ;
        },
        DifK: function(value) {
            return vix_tt_formatNumber(value) ;
        },
        DifP: function(value){

          if(value<0)
            value=0;

          if(value > 150 && value!=Infinity)
            value=150;


          value=Math.round(value);

          var barWidth = value*.66 + '%';
          var barValue = vix_tt_formatNumber(value)+'%   ';
      
          return '<div class="bar-container">' +
          '<span class="bar-value" style="width:60px">' + barValue + '</span>' + '<svg width="90%" height="10">'  
        + '<rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: white;margin-right:3px;"></rect></svg>' +        
          '</div>';
        },
        DifP: function(value){
          
          if(value<0)
          value=0;

          if(value > 150 && value!=Infinity)
            value=150;          

          if(value!=Infinity){
            var barWidth = value*.66 + '%';
            var barValue = vix_tt_formatNumber(value)+'%   ';
          }else{
            var barWidth =  '0%';
            var barValue = vix_tt_formatNumber(0)+'%   ';
          }            
        
          return '<div class="bar-container">' +
            '<span class="bar-value">' + barValue + '</span>' + '<svg width="90%" height="10">'  
            + '<rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: white;"></rect></svg>' +        
            '</div>';
        },
        PesoPlan: function(value) {
        
          return '<div style="padding-left:10px;">' +vix_tt_formatNumber(value)+'</div>';   ;
        },
        PesoReal: function(value) {
          return vix_tt_formatNumber(value) ;
        },
        DifPesos: function(value) {
          return vix_tt_formatNumber(value) ;
        }
      };

      
      $("#toolTip4").css("top",16+"%"); 

      if( 5 == $("#nivel_cb").val() ){
                 
          $("#toolTip4").css("left",1+"%");
          $("#toolTip4").css("top",70+"px");

          if(windowWidth > 1500 ){

            $("#toolTip4").css("top",90+"px");
            $("#toolTip4").css("left",100+"px");
           
          }

          vix_tt_formatToolTip("#toolTip4","Orígenes de Abasto hacia "+toTitleCase(entity.key)+"",svgTooltipWidth,svgTooltipHeight+100,dataManager.GetTooltipInfoData("toolTip4","Abasto"),"kpiExpert_ABAS.DrawTooltipDetail_Origen(kpiExpert_ABAS.lastEntity,true)");
      
        }else{

          $("#toolTip4").css("bottom","1%");
          $("#toolTip4").css("right","1%");                   

          vix_tt_formatToolTip("#toolTip4","Origenes de abasto hacia UN que atienden (TM) "+toTitleCase(entity.key)+"",svgTooltipWidth,svgTooltipHeight+100,dataManager.GetTooltipInfoData("toolTip4","Abasto"),"kpiExpert_ABAS.DrawTooltipDetail_Origen(kpiExpert_ABAS.lastEntity,true)");
      }   
     

      // COLUMNAS CON TOTALES :

      var columnsWithTotals = ['VolumenPlan','VolumenReal','DifK','PesoPlan','PesoReal','DifPesos']; 
      var totalsColumnVisitors = {
                'VolumenPlan': function(value) { 
                  return vix_tt_formatNumber(value) ;
                },
                'VolumenReal': function(value) { 
                  return vix_tt_formatNumber(value) ; 
                },
                'DifK': function(value) { 
                  return vix_tt_formatNumber(value) ; 
                },
                'PesoPlan': function(value) { 
                  return vix_tt_formatNumber(value) ; 
                },
                'PesoReal': function(value) { 
                  return vix_tt_formatNumber(value) ; 
                },
                'DifPesos': function(value) { 
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
     
      return;
      
      // APLICA TRANSICIONES 
    
      vix_tt_transitionRectWidth("toolTip4");
      
    
  }