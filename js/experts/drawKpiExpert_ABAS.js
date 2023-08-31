var kpiExpert_ABAS={};

kpiExpert_ABAS.eraseChart=function(){ 

    d3.select("#svgTooltip").selectAll(".abasDetail").data([]).exit().remove();
    d3.select("#svgTooltip3").selectAll(".abasDetail").data([]).exit().remove();
    d3.select("#svgTooltip4").selectAll(".abasDetail").data([]).exit().remove();
    d3.select("#svgTooltip5").selectAll(".abasDetail").data([]).exit().remove();
    
    $("#toolTip2").css("visibility","hidden");
    $("#toolTip3").css("visibility","hidden");
    $("#toolTip4").css("visibility","hidden");
    $("#toolTip5").css("visibility","hidden");

}

kpiExpert_ABAS.DrawTooltipDetail=function(entity){   

    $("#toolTip").css("visibility","hidden");        
    
    d3.select("#svgTooltip").selectAll(".abasDetail").data([]).exit().remove();
    d3.select("#svgTooltip3").selectAll(".abasDetail").data([]).exit().remove();
    d3.select("#svgTooltip4").selectAll(".abasDetail").data([]).exit().remove();
    d3.select("#svgTooltip5").selectAll(".abasDetail").data([]).exit().remove();

    kpiExpert_ABAS.DrawTooltipDetail_Transporte(entity);
    
    kpiExpert_ABAS.DrawTooltipDetail_Origen(entity);

    
    // VENTANA SE MUESTRA SI SE ESTA EN NIVEL DE UNIDAD DE NEGOCIO
    if( 4 == $("#nivel_cb").val() ){
        kpiExpert_ABAS.DrawTooltipDetail_UNComoOrigen(entity);  
    }else{
        kpiExpert_ABAS.DrawTooltipDetail_UN(entity);
    }           
     

}

kpiExpert_ABAS.DrawTooltipDetail_UNComoOrigen=function(entity){    

    var maximo=0;
    var maximoVolumen=0;

    var arrTemp=[];

    for(var i=0; i < store.abasto.length; i++ ){
        
        if(store.abasto[i].Origen==entity.key){
            console.log("insertaa");
            arrTemp.push(store.abasto[i]);
        }
            
    }
    
    var arr=d3.nest()
            .key(function(d) { return d.Destino; })
            .entries(arrTemp);   

   
    for(var i=0; i < arr.length; i++ ){
        arr[i].Dif=0;
    
        arr[i].VolumenReal=0;
        arr[i].VolumenPlan=0;
    
        for(var j=0; j < arr[i].values.length; j++ ){
        
            arr[i].VolumenReal+=Number(arr[i].values[j].VolumenReal);
            arr[i].VolumenPlan+=Number(arr[i].values[j].VolumenPlan);

        }         

        arr[i].DifPer=0;
        arr[i].Dif=0;

        if(arr[i].VolumenPlan>0){
            arr[i].Dif=arr[i].VolumenReal-arr[i].VolumenPlan;
            arr[i].DifPer=arr[i].VolumenReal/arr[i].VolumenPlan;
        }else{
            arr[i].Dif=0;
            arr[i].DifPer=0;
        }  
        
        if(maximo < arr[i].VolumenReal){
            maximo = arr[i].VolumenReal;
        }

        if(maximoVolumen < arr[i].DifPer*1000){
            maximoVolumen=arr[i].DifPer*1000;
        }

    } 

    arr = arr.sort((a, b) => b.Dif - a.Dif);    
    arr.reverse();

    var altura=30;
    var caso=0;

    var svgTooltipHeight=arr.length*altura;

    if(svgTooltipHeight<100)
        svgTooltipHeight=100;


    var svgTooltipWidth=600;
    var marginLeft=svgTooltipWidth*.2;
    var tamanioFuente=altura*.4;
    var marginTop=35;
    
    $("#toolTip5").css("visibility","visible");            
    $("#toolTip5").css("left",23+"%");
    $("#toolTip5").css("top",16+"%");

       
    /* 

        VIX_TT  : Prepara datos para el tool tip

    */


    // DATOS 

    var data = arr.map(function(item) {
        return {
          key: item.key,
          "VolumenPlan": item.VolumenPlan,
          "VolumenReal": item.VolumenReal,
          "DifK": item.VolumenReal - item.VolumenPlan,
          "DifP":  ((item.VolumenReal / item.VolumenPlan) ) * 100,
          "Peso": item.VolumenReal,
        };
        });
    
    
      
    
        // DEFINE COLUMNAS
      
      var columns = [
        { key: "key", header: "Producto", sortable: true, width: "100px" },
        { key: "VolumenPlan", header: "Vol Plan (T)", sortable: true, width: "100px" },
        { key: "VolumenReal", header: "Vol Real (T)", sortable: true, width: "100px" },
        { key: "DifK", header: "Dif (T)", sortable: true, width: "100px" },
        { key: "DifP", header: "Diferencia (%)", sortable: true,  width: "120px" },
        { key: "Peso", header: "Ponderación", sortable: true,  width: "100px" }
      ];
    
    
       // DEFINE VISITORS PARA CADA COLUMNA
    
    
      var columnVisitors = {
        key: function(value) {
            return `<div>${value}
            </div>`;
          },
    
        VolumenPlan: function(value) {
          return vix_tt_formatNumber(value) + "T";
        },
        VolumenReal: function(value) {
            return vix_tt_formatNumber(value) + "T";
        },
        DifK: function(value) {
            return vix_tt_formatNumber(value) + "T";
        },
        DifP: function(value){
      
            var barWidth = value + '%';
            var barValue = vix_tt_formatNumber(value)+'%   ';
        
            return '<div class="bar-container">' +
            '<span class="bar-value">' + barValue + '</span>' + '<svg width="100%" height="10">'  
            + '<rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: white;"></rect></svg>' +        
            '</div>';
        },
        Peso: function(value){
      
            var barWidth = (value/maximoVolumen)*100 + '%';
            var barValue = vix_tt_formatNumber(value)+'k';
       
           return '<div class="bar-container">' +
           '<svg width="100%" height="10"><rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: yellow;"></rect></svg>' +      
           '</div>';
        }
      };
    
    
      // FORMATEA DIV :
    
      vix_tt_formatToolTip("#toolTip5","Abasto por U.N. como Origen " ,700);
    
      
            // COLUMNAS CON TOTALES :
    
            var columnsWithTotals = ['VolumenPlan','VolumenReal','DifK']; 
            var totalsColumnVisitors = {
                      'VolumenPlan': function(value) { 
                        return vix_tt_formatNumber(value) + "T";
                      },
                      'VolumenReal': function(value) { 
                        return vix_tt_formatNumber(value) + "T"; 
                      },
                      'DifK': function(value) { 
                        return vix_tt_formatNumber(value) + "T"; 
                      }
                      };
      
          
          
           
          
      // CREA TABLA USANDO DATOS
          
      vix_tt_table_extended(data, columns, columnVisitors, totalsColumnVisitors, "toolTip5", columnsWithTotals );
     
      
      
      // APLICA TRANSICIONES 
    
      vix_tt_transitionRectWidth("toolTip5");
      
    
    }
    
kpiExpert_ABAS.DrawTooltipDetail_Transporte=function(entity){    
   
    var maximo=0;
    var maximoVolumen=0;   
   
    var arr=d3.nest()
            .key(function(d) { return d.Transporte; })
            .entries(entity.abasto.values);         
    
    for(var i=0; i < arr.length; i++ ){
        arr[i].Dif=0;
      
        arr[i].VolumenReal=0;
        arr[i].VolumenPlan=0;      

        for(var j=0; j < arr[i].values.length; j++ ){
        
            arr[i].VolumenReal+=Number(arr[i].values[j].VolumenReal);
            arr[i].VolumenPlan+=Number(arr[i].values[j].VolumenPlan);         

        }
        
        if(arr[i].VolumenReal>0){
            arr[i].Dif=arr[i].VolumenReal-arr[i].VolumenPlan;
            arr[i].DifPer=arr[i].VolumenReal/arr[i].VolumenPlan;
        }else{
            arr[i].Dif=0;
            arr[i].DifPer=0;
        }  
        
        if(maximo < arr[i].VolumenReal){
            maximo = arr[i].VolumenReal;
        }

        if(maximoVolumen < arr[i].DifPer*1000){
            maximoVolumen=arr[i].DifPer*1000;
        }

    } 
    
    arr = arr.sort((a, b) => b.Dif - a.Dif);    
    arr.reverse();

    var altura=30;
    var caso=0;
   
    var svgTooltipHeight=arr.length*altura;

    if(svgTooltipHeight<100)
    svgTooltipHeight=100;

    var svgTooltipWidth=500;
    var marginLeft=svgTooltipWidth*.15;
    var tamanioFuente=altura*.4;
    var marginTop=35;

       


   

    

    $("#toolTip2").css("visibility","visible");            
    $("#toolTip2").css("top","75%");
    $("#toolTip2").css("left","23%");
    
    
    /* 

        VIX_TT  : Prepara datos para el tool tip

    */


    // DATOS 

    var data = arr.map(function(item) {
        return {
          key: item.key,
          "VolumenPlan": item.VolumenPlan,
          "VolumenReal": item.VolumenReal,
          "DifK": item.VolumenReal - item.VolumenPlan,
          "DifP":  ((item.VolumenReal / item.VolumenPlan) ) * 100,
          "Peso": item.VolumenReal,
        };
        });
    
    
      
    
        // DEFINE COLUMNAS
      
      var columns = [
        { key: "key", header: "Producto", sortable: true, width: "100px" },
        { key: "VolumenPlan", header: "Vol Plan (T)", sortable: true, width: "100px" },
        { key: "VolumenReal", header: "Vol Real (T)", sortable: true, width: "100px" },
        { key: "DifK", header: "Dif (T)", sortable: true, width: "100px" },
        { key: "DifP", header: "Diferencia (%)", sortable: true,  width: "120px" },
        { key: "Peso", header: "Ponderación", sortable: true,  width: "100px" }
      ];
    
    
       // DEFINE VISITORS PARA CADA COLUMNA
    
    
      var columnVisitors = {
        key: function(value) {
            return `<div>${value}
            </div>`;
          },
    
        VolumenPlan: function(value) {
          return vix_tt_formatNumber(value) + "T";
        },
        VolumenReal: function(value) {
            return vix_tt_formatNumber(value) + "T";
        },
        DifK: function(value) {
            return vix_tt_formatNumber(value) + "T";
        },
        DifP: function(value){
      
            var barWidth = value + '%';
            var barValue = vix_tt_formatNumber(value)+'%   ';
        
            return '<div class="bar-container">' +
            '<span class="bar-value">' + barValue + '</span>' + '<svg width="100%" height="10">'  
            + '<rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: white;"></rect></svg>' +        
            '</div>';
        },
        Peso: function(value){
      
            var barWidth = (value/maximoVolumen)*100 + '%';
            var barValue = vix_tt_formatNumber(value)+'k';
       
           return '<div class="bar-container">' +
           '<svg width="100%" height="10"><rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: yellow;"></rect></svg>' +      
           '</div>';
        }
      };
    
    
      // FORMATEA DIV :
    
      vix_tt_formatToolTip("#toolTip2","Abasto por Tipo de Transporte",700);
    
      
            // COLUMNAS CON TOTALES :
    
            var columnsWithTotals = ['VolumenPlan','VolumenReal','DifK']; 
            var totalsColumnVisitors = {
                      'VolumenPlan': function(value) { 
                        return vix_tt_formatNumber(value) + "T";
                      },
                      'VolumenReal': function(value) { 
                        return vix_tt_formatNumber(value) + "T"; 
                      },
                      'DifK': function(value) { 
                        return vix_tt_formatNumber(value) + "T"; 
                      }
                      };
      
          
          
           
          
      // CREA TABLA USANDO DATOS
          
            vix_tt_table_extended(data, columns, columnVisitors, totalsColumnVisitors, "toolTip2", columnsWithTotals );
     
      
      
      // APLICA TRANSICIONES 
    
      vix_tt_transitionRectWidth("toolTip2");
      
    
    }
    
    kpiExpert_ABAS.DrawTooltipDetail_UN=function(entity){  

        var maximo=0;    
        var maximoVolumen=0;   
    
        var arr=d3.nest()
                .key(function(d) { return d.Destino; })
                .entries(entity.abasto.values);

        
        for(var i=0; i < arr.length; i++ ){
            arr[i].Dif=0;
        
            arr[i].VolumenReal=0;
            arr[i].VolumenPlan=0;
        
            for(var j=0; j < arr[i].values.length; j++ ){
            
                arr[i].VolumenReal+=Number(arr[i].values[j].VolumenReal);
                arr[i].VolumenPlan+=Number(arr[i].values[j].VolumenPlan);

            }         

            arr[i].DifPer=0;
            arr[i].Dif=0;

            if(arr[i].VolumenPlan>0){
                arr[i].Dif=arr[i].VolumenReal-arr[i].VolumenPlan;
                arr[i].DifPer=arr[i].VolumenReal/arr[i].VolumenPlan;
            }else{
                arr[i].Dif=0;
                arr[i].DifPer=0;
            }  
            
            if(maximo < arr[i].VolumenReal){
                maximo = arr[i].VolumenReal;
            }

            if(maximoVolumen < arr[i].DifPer*1000){
                maximoVolumen=arr[i].DifPer*1000;
            }

        } 
        
        arr = arr.sort((a, b) => b.Dif - a.Dif);    
        arr.reverse();

        var altura=30;
        var caso=0;
    
        var svgTooltipHeight=arr.length*altura;

        if(svgTooltipHeight<100)
            svgTooltipHeight=100;


        var svgTooltipWidth=600;
        var marginLeft=svgTooltipWidth*.2;
        var tamanioFuente=altura*.4;
        var marginTop=35;

        $("#toolTip3").css("visibility","visible");            
        $("#toolTip3").css("left",23+"%");
        $("#toolTip3").css("top",5+"%");      

            
    /* 

        VIX_TT  : Prepara datos para el tool tip

    */


    // DATOS 

    var data = arr.map(function(item) {
        return {
          key: item.key,
          "VolumenPlan": item.VolumenPlan,
          "VolumenReal": item.VolumenReal,
          "DifK": item.VolumenReal - item.VolumenPlan,
          "DifP":  item.DifPer * 100,
          "Peso": item.VolumenReal,
        };
        });
    
    
      
    
        // DEFINE COLUMNAS
      
      var columns = [
        { key: "key", header: "Producto", sortable: true, width: "100px" },
        { key: "VolumenPlan", header: "Vol Plan (T)", sortable: true, width: "100px" },
        { key: "VolumenReal", header: "Vol Real (T)", sortable: true, width: "100px" },
        { key: "DifK", header: "Dif (T)", sortable: true, width: "100px" },
        { key: "DifP", header: "Diferencia (%)", sortable: true,  width: "120px" },
        { key: "Peso", header: "Ponderación", sortable: true,  width: "100px" }
      ];
    
    
         // DEFINE VISITORS PARA CADA COLUMNA
    
    
      var columnVisitors = {
        key: function(value) {
            return `<div class="key-selector" onclick="filterControls.lookForEntity('${value}')">${value}
            </div>`;
          },
    
        VolumenPlan: function(value) {
          return vix_tt_formatNumber(value) + "T";
        },
        VolumenReal: function(value) {
            return vix_tt_formatNumber(value) + "T";
        },
        DifK: function(value) {
            return vix_tt_formatNumber(value) + "T";
        },
        DifP: function(value){
      
            var barWidth = value + '%';
            var barValue = vix_tt_formatNumber(value)+'%   ';
        
            '<span class="bar-value">' + barValue + '</span>' + '<svg width="100%" height="10">'  
        + '<rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: white;"></rect></svg>' +        
        '</div>';
        },
        Peso: function(value){
      
            var barWidth = (value/maximoVolumen)*100 + '%';
            var barValue = vix_tt_formatNumber(value)+'k';
       
           return '<div class="bar-container">' +
           '<svg width="100%" height="10"><rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: yellow;"></rect></svg>' +      
           '</div>';
        }
      };
    
    
      // FORMATEA DIV :
    
      vix_tt_formatToolTip("#toolTip3","Abasto por U.N. Entrega Final",700);
    
      
            // COLUMNAS CON TOTALES :
    
            var columnsWithTotals = ['VolumenPlan','VolumenReal','DifK']; 
            var totalsColumnVisitors = {
                      'VolumenPlan': function(value) { 
                        return vix_tt_formatNumber(value) + "T";
                      },
                      'VolumenReal': function(value) { 
                        return vix_tt_formatNumber(value) + "T"; 
                      },
                      'DifK': function(value) { 
                        return vix_tt_formatNumber(value) + "T"; 
                      }
                      };
      
          
          
           
          
      // CREA TABLA USANDO DATOS
          
            vix_tt_table_extended(data, columns, columnVisitors, totalsColumnVisitors, "toolTip3", columnsWithTotals );
     
      
      
      // APLICA TRANSICIONES 
    
      vix_tt_transitionRectWidth("toolTip3");
      
    
    }



kpiExpert_ABAS.DrawTooltipDetail_Origen=function(entity){  

        var maximo=0;    
        var maximoVolumen=0;   
    
        var arr=d3.nest()
                .key(function(d) { return d.Origen; })
                .entries(entity.abasto.values);

        
        for(var i=0; i < arr.length; i++ ){

            arr[i].Dif=0;
            
            arr[i].VolumenReal=0;
            arr[i].VolumenPlan=0;
        
           
            for(var j=0; j < arr[i].values.length; j++ ){
            
                arr[i].VolumenReal+=Number(arr[i].values[j].VolumenReal);
                arr[i].VolumenPlan+=Number(arr[i].values[j].VolumenPlan);               
                
            }
          
            if(arr[i].VolumenPlan>0){
                arr[i].Dif=arr[i].VolumenReal-arr[i].VolumenPlan;
                arr[i].DifPer=arr[i].VolumenReal/arr[i].VolumenPlan;
            }else{
                arr[i].Dif=0;
                arr[i].DifPer=0;
            }  
            
            if(maximo < arr[i].VolumenReal){
                maximo = arr[i].VolumenReal;
            }

            if(maximoVolumen < arr[i].DifPer*1000){
                maximoVolumen=arr[i].DifPer*1000;
            }     

        } 
        
        arr = arr.sort((a, b) => b.Dif - a.Dif);    
        arr.reverse();

        var altura=30;
        var caso=0;
    
        var svgTooltipHeight=arr.length*altura;

        if(svgTooltipHeight<100)
            svgTooltipHeight=100;


        var svgTooltipWidth=600;
        var marginLeft=svgTooltipWidth*.2;
        var tamanioFuente=altura*.4;
        var marginTop=35;

        $("#toolTip4").css("visibility","visible");    
        $("#toolTip4").css("left",62+"%");
        $("#toolTip4").css("top",16+"%");      
        
         
        

        $("#toolTip4").append("<svg id='svgTooltip4'  style='pointer-events:none; line-heigth:22px;'></svg> ");
    
    /* 

        VIX_TT  : Prepara datos para el tool tip

    */


    // DATOS 

    var data = arr.map(function(item) {
        return {
          key: item.key,
          "VolumenPlan": item.VolumenPlan,
          "VolumenReal": item.VolumenReal,
          "DifK": item.VolumenReal - item.VolumenPlan,
          "DifP":  item.DifPer * 100,
          "Peso": item.VolumenReal,
        };
        });   
    
      
    
        // DEFINE COLUMNAS
      
      var columns = [
        { key: "key", header: "Producto", sortable: true, width: "100px" },
        { key: "VolumenPlan", header: "Vol Plan (T)", sortable: true, width: "100px" },
        { key: "VolumenReal", header: "Vol Real (T)", sortable: true, width: "100px" },
        { key: "DifK", header: "Dif (T)", sortable: true, width: "100px" },
        { key: "DifP", header: "Diferencia (%)", sortable: true,  width: "120px" },
        { key: "Peso", header: "Ponderación", sortable: true,  width: "100px" }
      ];
    
    
        // DEFINE VISITORS PARA CADA COLUMNA
    
    
        var columnVisitors = {
            key: function(value) {
                return `<div class="key-selector" onclick="filterControls.lookForEntity('${value}')">${value}
                </div>`;
              },
    
        VolumenPlan: function(value) {
          return vix_tt_formatNumber(value) + "T";
        },
        VolumenReal: function(value) {
            return vix_tt_formatNumber(value) + "T";
        },
        DifK: function(value) {
            return vix_tt_formatNumber(value) + "T";
        },
        DifP: function(value){
      
            var barWidth = value + '%';
            var barValue = vix_tt_formatNumber(value)+'%   ';
        
            return '<div class="bar-container">' +
            '<span class="bar-value">' + barValue + '</span>' + '<svg width="100%" height="10">'  
        + '<rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: white;"></rect></svg>' +        
        '</div>';
        },
        Peso: function(value){
      
            var barWidth = (value/maximo)*100 + '%';
            var barValue = vix_tt_formatNumber(value)+'k';
       
           return '<div class="bar-container">' +
           '<svg width="100%" height="10"><rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: yellow;"></rect></svg>' +      
           '</div>';
        }
      };
    
      if( 4 == $("#nivel_cb").val() ){
        vix_tt_formatToolTip("#toolTip4","Orígenes de Abasto hacia "+toTitleCase(entity.key)+"",700);
      }else{
          vix_tt_formatToolTip("#toolTip4","Orígenes de Abasto hacia U.N. Entrega Final",700);
      } 
   
      
            // COLUMNAS CON TOTALES :
    
            var columnsWithTotals = ['VolumenPlan','VolumenReal','DifK']; 
            var totalsColumnVisitors = {
                      'VolumenPlan': function(value) { 
                        return vix_tt_formatNumber(value) + "T";
                      },
                      'VolumenReal': function(value) { 
                        return vix_tt_formatNumber(value) + "T"; 
                      },
                      'DifK': function(value) { 
                        return vix_tt_formatNumber(value) + "T"; 
                      }
                      };
      
          
          
           
          
      // CREA TABLA USANDO DATOS
          
            vix_tt_table_extended(data, columns, columnVisitors, totalsColumnVisitors, "toolTip4", columnsWithTotals );
     
      
      
      // APLICA TRANSICIONES 
    
      vix_tt_transitionRectWidth("toolTip4");
      
    
    }