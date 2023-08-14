var dataManager={};

dataManager.CambiaModoKPI=function(){

    if(store.map_var==kpiExpert_FR){
   
        store.map_var=kpiExpert_OOS;
    
    }else if(store.map_var==kpiExpert_OOS){
      
        store.map_var=kpiExpert_FR;
      
    }

    dataManager.ClusterObjects();

}

//PROCESO QUE AGRUPA ELEMENTOS SEGUN EL NIVEL AL Q SE ENCUENTRA
var entities;
dataManager.ClusterObjects=function(){


    Stage.blockScreen.style("visibility","visible"); 
    
    Stage.EraseMapObjects();

    if(svgRadar){
        radar.CleanWindows();
        svgRadar.selectAll(".radarElement").data([]).exit().remove();
       
    }      

    if(backInfoNav.entity){

        for(var j=0; j < store.niveles.length; j++){
                       
                if( String(store.niveles[j].id) ==  String($("#nivel_cb").val()) ){

                    if(store.niveles[j].coordinatesSource != backInfoNav.catlog ){

                        $("#back_btn").css("visibility","visible");

                    }
                }
            
        }
       
    }
    

    var agrupador="";

    
    for(var i=0; i < store.niveles.length; i++){    
       if( store.niveles[i].id == $("#nivel_cb").val() )
            agrupador=store.niveles[i].field;           
    }

    if(!agrupador==""){
        entities  = d3.nest()
                        .key(function(d) { return  d[agrupador]; })                           
                        .entries(store.dataToDraw);
    }else{
        entities = [{key:"Nacional" , values:store.dataToDraw}];
    }    

    
    //Utiliza un timeout solo para q sea posible poner una pantalla de espera (negra)
    setTimeout(()=>{

        filterControls.showActiveFilters();

        dataManager.CalculateKPIs(entities);
        $('#Controls').hide();

        //en casod e que exista un campo ara busqueda de entidades lo llena
        if( $("#inputEnfoqueCamara") ){

            $("#inputEnfoqueCamara").val("");

            var arrAutoCompleteArr=[];   

            for(var j=0;  j < entities.length; j++){
                arrAutoCompleteArr.push(entities[j].key);
            }

            autocomplete(document.getElementById("inputEnfoqueCamara"), arrAutoCompleteArr);
        }

    }, 100);

}



//PROCESO QUE GESTIONA CALCULOS DE KPI´s SEGUN EL NIVEL EN EL Q SE ENCUENTRA
var loadsCount=0;
var loadsTarget=0;

dataManager.CalculateKPIs=function(entities_){ 

    console.log("CalculateKPIs");   

    loadsCount=0;

    loadsTarget=0;

    // 1
    loadsTarget++;
    setTimeout(()=>{
        entities = calculateKpiExpert_FR.calculateKPI(entities_,"fillRate",dataManager.checkAllLoads);    
    }, 500);    
    
    
    // 2   
    if(calculateKpiExpert_OOS){

        loadsTarget++;
        setTimeout(()=>{

            calculateKpiExpert_OOS.calculateKPI(entities).then(()=>{
                loadsCount++;
                dataManager.checkAllLoads();
             }); 

        }, 500);   

    }    


    // 3
    if(store.map_var==kpiExpert_OOS){

        if(calculateKpiExpert_OOSFiliales){
            loadsTarget++;
            setTimeout(()=>{
                calculateKpiExpert_OOSFiliales.calculateKPI(entities).then(()=>{
                    loadsCount++;
                    dataManager.checkAllLoads();
                });
            }, 500);
       

        } 
    }
    
   
    // 4
    if(calculateKpiExpert_Ventas){
        loadsTarget++;
        setTimeout(()=>{
            calculateKpiExpert_Ventas.calculateKPI(entities).then(()=>{
                                                                    loadsCount++;
                                                                    dataManager.checkAllLoads();
                                                             });
        }, 500);
    }  
    
    
    // 5
    if(calculateKpiExpert_Abasto && $("#nivel_cb").val() ){

        loadsTarget++;
        setTimeout(()=>{
        calculateKpiExpert_Abasto.calculateKPI(entities).then(()=>{
                                                                loadsCount++;
                                                                dataManager.checkAllLoads();
                                                             });
        }, 500);
    }     


    if(store.map_var==kpiExpert_FR){

            // 6
            if(calculateKpiExpert_Pendientes && $("#nivel_cb").val() ){
                loadsTarget++;
                setTimeout(()=>{
                    calculateKpiExpert_Pendientes.calculateKPI(entities).then(()=>{
                                                                        loadsCount++;
                                                                        dataManager.checkAllLoads();
                                                                        });
                }, 500);
            }   
        
        
            // 7  
            if(calculateKpiExpert_Mas){
                loadsTarget++;
                setTimeout(()=>{
                    calculateKpiExpert_Mas.calculateKPI(entities,dataManager.checkAllLoads);
                }, 500);
            }  

    }
    

    // 8
    if(calculateKpiExpert_Produccion && $("#nivel_cb").val()  ){
        loadsTarget++;
        setTimeout(()=>{
            calculateKpiExpert_Produccion.calculateKPI(entities).then(()=>{
                                                                loadsCount++;
                                                                dataManager.checkAllLoads();
                                                             });
        }, 500);
    } 


}

dataManager.checkAllLoads=function(){ 
    
    console.log(loadsTarget,loadsCount);

    if(loadsTarget==loadsCount){

        radar.DrawEntities(entities);

        Stage.DrawMapObjects(entities);

        kpiExpert_FR.DrawMainHeader();

        kpiExpert_FR.DrawFilteredHeader();

    }
}

dataManager.getTooltipText=function(entity){

    var dataCatlog="";
    var nombre = entity.key;  
    
    for(var i=0; i < store.niveles.length; i++){    

        if( store.niveles[i].id == $("#nivel_cb").val() ){

            dataCatlog=store[store.niveles[i].coordinatesSource]; 

            if(dataCatlog){
            
                for(var j=0; j < dataCatlog.length; j++){    
                
                    if(dataCatlog[j].ID==entity.key){
                        if(dataCatlog[j].Nombre!=nombre)
                            nombre+=" "+dataCatlog[j].Nombre;
                    }
                        
                }

            }
        }						
    }

    nombre=nombre.replaceAll("_"," ");
    nombre=nombre.replaceAll("undefined"," ");


    var text=`
        <span style='color:#00C6FF;font-size:15px;'><span style='color:#00C6FF'>${nombre}<br>
        `
        if(calculateKpiExpert_Ventas.getTooltipDetail){

            if(calculateKpiExpert_Ventas.getTooltipDetail(entity.key)!=undefined){
                if(entity.ventas)
                    text+=calculateKpiExpert_Ventas.getTooltipDetail(entity.key);
            }

        }

        if(calculateKpiExpert_FR.getTooltipDetail){

            if(store.map_var==kpiExpert_FR)
                text+=calculateKpiExpert_FR.getTooltipDetail(entity.key,store.mainDataset);
            
        }

        if(calculateKpiExpert_Pendientes.getTooltipDetail){

            if(calculateKpiExpert_Pendientes.getTooltipDetail(entity.key)!=undefined){
                if(entity.pendientes)
                    text+=calculateKpiExpert_Pendientes.getTooltipDetail(entity.key);
            }

        }

        if(calculateKpiExpert_Mas.getTooltipDetail){

            if(calculateKpiExpert_Mas.getTooltipDetail(entity.key)!=undefined){
                if(entity.masivos)
                    text+=calculateKpiExpert_Mas.getTooltipDetail(entity.key);
            }

        }

        if(calculateKpiExpert_OOS.getTooltipDetail){

            if(calculateKpiExpert_OOS.getTooltipDetail(entity.key)!=undefined){
                if(entity.oos)
                    text+=calculateKpiExpert_OOS.getTooltipDetail(entity.key);
            }

        }

        if(calculateKpiExpert_OOSFiliales.getTooltipDetail){

            if(calculateKpiExpert_OOSFiliales.getTooltipDetail(entity.key)!=undefined){
                if(entity.oosFiliales)
                    text+=calculateKpiExpert_OOSFiliales.getTooltipDetail(entity.key);
            }

        }

        if(calculateKpiExpert_Abasto.getTooltipDetail){

            if(calculateKpiExpert_Abasto.getTooltipDetail(entity.key)!=undefined){
                if(entity.abasto)
                    text+=calculateKpiExpert_Abasto.getTooltipDetail(entity.key);
            }

        }

        if(calculateKpiExpert_Produccion.getTooltipDetail){

            if(calculateKpiExpert_Produccion.getTooltipDetail(entity.key)!=undefined){
                if(entity.produccion)
                    text+=calculateKpiExpert_Produccion.getTooltipDetail(entity.key);
            }

        } 

        return text;

}