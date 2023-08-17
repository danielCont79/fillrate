var drawKpiExpert_VENTAS={};





drawKpiExpert_VENTAS.eraseChart=function(){

    d3.select("#svgTooltip").selectAll(".ventasDetail").data([]).exit().remove();
    d3.select("#svgTooltip3").selectAll(".ventasDetail").data([]).exit().remove();

    $("#toolTip2").css("visibility","hidden");
    $("#toolTip3").css("visibility","hidden");

}


drawKpiExpert_VENTAS.DrawTooltipDetail=function(entity){

    d3.select("#svgTooltip").selectAll(".ventasDetail").data([]).exit().remove();
    d3.select("#svgTooltip3").selectAll(".ventasDetail").data([]).exit().remove();

    drawKpiExpert_VENTAS.DrawTooltipDetail_Producto_Presentacion(entity);
    drawKpiExpert_VENTAS.DrawTooltipDetail_Estado(entity);

}

drawKpiExpert_VENTAS.DrawTooltipDetail_Producto_Presentacion=function(entity){

    var maximo=0;
    var maximoVolumen=0;

    var arr=d3.nest()
            .key(function(d) { return d.AgrupProducto; })
            .entries(entity.ventas.values);

    for(var i=0; i < arr.length; i++ ){

        arr[i].Dif=0;
        arr[i].VolReal_FR=0;
        arr[i].VolPlan_FR =0;
        arr[i].VolumenReal=0;
        arr[i].VolumenPlan=0;
        arr[i].PctReal_FR=0;

        for(var j=0; j < arr[i].values.length; j++ ){

            arr[i].VolumenPlan+=Number(arr[i].values[j].VolumenPlan);
            arr[i].VolumenReal+=Number(arr[i].values[j].VolumenReal);
            arr[i].VolPlan_FR+=Number(arr[i].values[j].VolPlan_FR);
            arr[i].VolReal_FR+=Number(arr[i].values[j].VolReal_FR);

        }

        if(arr[i].VolumenReal>0){
            arr[i].difPer=arr[i].VolumenReal/arr[i].VolumenPlan;
            arr[i].difVal=arr[i].VolumenReal-arr[i].VolumenPlan;
        }else{
            arr[i].difPer=0;
        }

        arr[i].difPer=arr[i].difPer*100;

        if(maximo < arr[i].difPer){
            maximo=arr[i].difPer;
        }

        if(maximoVolumen < arr[i].VolumenReal){
            maximoVolumen=arr[i].VolumenReal;
        }


    }

    arr = arr.sort((a, b) => b.difVal - a.difVal);
    arr.reverse();

    var altura=30;
    var caso=0;

    var svgTooltipHeight=(arr.length*altura)+50;
    var svgTooltipWidth=550;
    var marginLeft=svgTooltipWidth*.2;
    var tamanioFuente=altura*.4;
    var marginTop=35;



    $("#toolTip3").css("visibility","visible");
    $("#toolTip3").css("top",15+"%");
    $("#toolTip3").css("left",63+"%");

    if( (mouse_y-100)+(arr.length*altura) > windowHeight  )
        $("#toolTip3").css("top",(windowHeight-(arr.length*altura)-150)+"px");

  d3.select("#toolTip3")
    .style("width", (svgTooltipWidth)+"px" );



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
      Peso: item.VolumenReal
    };
    });




    // DEFINE COLUMNAS

  var columns = [
    { key: "key", header: "Producto", sortable: true, width: "100px" },
    { key: "VolumenPlan", header: "Vol Plan (k)", sortable: true, width: "100px" },
    { key: "VolumenReal", header: "Vol Real (k)", sortable: true, width: "100px" },
    { key: "DifK", header: "Dif (k)", sortable: true, width: "100px" },
    { key: "DifP", header: "Diferencia (%)", sortable: true,  width: "120px" },
    { key: "Peso", header: "Peso", sortable: true,  width: "100px" }
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
        '<svg width="100%" height="10"><rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: white;"></rect></svg>' +
        '<span class="bar-value">' + barValue + '</span>' +
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

  vix_tt_formatToolTip("#toolTip3","Detalle de Ventas por Producto y Presentación",700);


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

drawKpiExpert_VENTAS.DrawTooltipDetail_Estado=function(entity){

    var maximo=0;
    var maximoVolumen=0;

    var arr=d3.nest()
            .key(function(d) { return d.EstadoDem; })
            .entries(entity.ventas.values);


    for(var i=0; i < arr.length; i++ ){

        arr[i].Dif=0;
        arr[i].VolReal_FR=0;
        arr[i].VolPlan_FR =0;
        arr[i].VolumenReal=0;
        arr[i].VolumenPlan=0;
        arr[i].PctReal_FR=0;

        for(var j=0; j < arr[i].values.length; j++ ){

            arr[i].VolumenPlan+=Number(arr[i].values[j].VolumenPlan);
            arr[i].VolumenReal+=Number(arr[i].values[j].VolumenReal);
            arr[i].VolPlan_FR+=Number(arr[i].values[j].VolPlan_FR);
            arr[i].VolReal_FR+=Number(arr[i].values[j].VolReal_FR);

        }

        if(arr[i].VolumenReal>0){
            arr[i].difPer=arr[i].VolumenReal/arr[i].VolumenPlan;
            arr[i].difVal=arr[i].VolumenReal/arr[i].VolumenPlan;
            arr[i].difResta=arr[i].VolumenReal-arr[i].VolumenPlan;
        }else{
            arr[i].difPer=0;
        }

        arr[i].difPer=arr[i].difPer*100;

        if(maximo < arr[i].difPer){
            maximo=arr[i].difPer;
        }
        if(maximoVolumen < arr[i].VolumenReal){
            maximoVolumen=arr[i].VolumenReal;
        }

    }

    arr = arr.sort((a, b) => b.difResta - a.difResta);
    arr.reverse();


    var altura=30;
    var caso=0;

    var svgTooltipHeight=(arr.length*altura)+50;
    var svgTooltipWidth=530;
    var marginLeft=svgTooltipWidth*.2;
    var tamanioFuente=altura*.4;
    var marginTop=35;

    $("#toolTip2").css("visibility","visible");
    $("#toolTip2").css("top",15+"%");
    $("#toolTip2").css("left",24+"%");

    if( (mouse_y-100)+(arr.length*altura) > windowHeight  )
        $("#toolTip2").css("top",(windowHeight-(arr.length*altura)-150)+"px");

    var toolText =
        "<span style='color:#fff600'><span style='color:#ffffff'>Detalle Ventas por Estado</span></span>"+
        "<svg id='svgTooltip'  style='pointer-events:none;'></svg> ";

    $("#toolTip2").html(toolText);


    // DATOS

    var data = arr.map(function(item) {
        return {

          key: item.key,
          "VolumenPlan": item.VolumenPlan,
          "VolumenReal": item.VolumenReal,
          "DifK": item.VolumenReal - item.VolumenPlan,
          "DifP":  ((item.VolumenReal / item.VolumenPlan) ) * 100,
          Peso: item.VolumenReal
        };
        });




        // DEFINE COLUMNAS

      var columns = [
        { key: "key", header: "Estado", sortable: true, width: "100px" },
        { key: "VolumenPlan", header: "Vol Plan", sortable: true, width: "100px" },
        { key: "VolumenReal", header: "Vol Real", sortable: true, width: "100px" },
        { key: "DifK", header: "Dif (k)", sortable: true, width: "100px" },
        { key: "DifP", header: "Diferencia (%)", sortable: true,  width: "120px" },
        { key: "Peso", header: "Peso", sortable: true,  width: "100px" }
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
            var barValue = vix_tt_formatNumber(value)+'%';

            return '<div class="bar-container">' +
            '<svg width="100%" height="10"><rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: white;"></rect></svg>' +
            '<span class="bar-value">' + barValue + '</span>' +
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







      // FORMATEA DIV :

      vix_tt_formatToolTip("#toolTip2","Detalle de Ventas por Estado",700);


      // CREA TABLA USANDO DATOS


      vix_tt_table_extended(data, columns, columnVisitors, totalsColumnVisitors, "toolTip2", columnsWithTotals );


      // APLICA TRANSICIONES

      vix_tt_transitionRectWidth("toolTip2");




}
