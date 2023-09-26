
var kpi_date_status={};

kpi_date_status.loadData = function(muestra ){

    $("#cargando").css("visibility","visible");

    var serviceName;

    var dateInit_=dateInit.getFullYear()+"-"+String(Number(dateInit.getMonth())+1)+"-"+dateInit.getDate();
    var dateEnd_=dateEnd.getFullYear()+"-"+String(Number(dateEnd.getMonth())+1)+"-"+dateEnd.getDate();
    
    var apiURL= _bkserver+"/getSP/VIS_ObtenerFechas?Pantalla=Fillrate&fechaInicio="+dateInit_+"&fechaFin="+dateEnd_+"";
    console.log(apiURL);

    d3.json(apiURL, function (error, data) {

        $("#cargando").css("visibility","hidden");

        if(error){
            alert("Error API Fehas de KPI",error);
           
            return;
        }

        if(data.error){
            alert("Error API Fehas de KPI",data.error);
           
            return;
        }

        console.log("Fehas de KPIs",data.recordset);     

        kpi_date_status.data=data.recordset;

        var cuantos=0;
        for(var i=0; i < kpi_date_status.data.length; i++ ){
            if(kpi_date_status.data[i].esWarning > 0){
                cuantos+=kpi_date_status.data[i].esWarning;
            }

        }

        if(cuantos > 0){
            $("#dates_img").attr("src","images/dates_1.png");
        }
         if(cuantos > 2){
            $("#dates_img").attr("src","images/dates_2.png");
        }

        if(muestra)
            kpi_date_status.ShowWindows();

    });
}   

kpi_date_status.ShowWindows = function( ){

        var data=[];

        for(var i=0; i < kpi_date_status.data.length; i++ ){

            if(kpi_date_status.data[i].esWarning > 0){

                var fechaSplit=kpi_date_status.data[i].maxFecha.split("T");
                            
                //fechaSplit=fechaSplit[0].split("-"); 

                //kpi_date_status.data[i].max_fecha= new Date(Number(fechaSplit[0]),Number(fechaSplit[1])-1 ,Number(fechaSplit[2]));   
                kpi_date_status.data[i].max_fecha=fechaSplit[0];
                data.push(kpi_date_status.data[i]);
            }                

        }

        $("#toolTip3").css("visibility","visible");  
        $("#toolTip3").css("inset","");           
        $("#toolTip3").css("bottom","90px");
        $("#toolTip3").css("right","100px");

        // DATOS 
        var data = data.map(function(item) {
            return {
                "Indicador": item.Indicador,
                "max_fecha": item.max_fecha         
            };
        });

        // DEFINE COLUMNAS      
        var columns = [

            { key: "Indicador", header: "KPI", sortable: true, width: "250px" },
            { key: "max_fecha", header: "Última Fecha", sortable: true, width: "150px" }
        
        
        ];

        // DEFINE VISITORS PARA CADA COLUMNA
        var columnVisitors = {
            Indicador: function(value) {
                return `<div class="key-selector" onclick="">${value}
                </div>`;
              },
        
            max_fecha: function(value){
                return `<div class="key-selector" onclick="">${value}
                </div>`;
            }
        };
        var columnsWithTotals = ['Indicador']; 
        var totalsColumnVisitors = {
            'Indicador': function(value) { 
                return ""; 
            }              
          
          };

        vix_tt_formatToolTip("#toolTip3","Utimas fechas disponibles por KPI (solo aquellas con warnings) ",400,300);
      
        // CREA TABLA USANDO DATOS
      
        vix_tt_table_extended(data, columns, columnVisitors, totalsColumnVisitors, "toolTip3", columnsWithTotals );        

        // APLICA TRANSICIONES 
        vix_tt_transitionRectWidth("toolTip3");

}