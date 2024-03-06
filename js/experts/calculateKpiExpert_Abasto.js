var calculateKpiExpert_Abasto={};

calculateKpiExpert_Abasto.calculateKPI=function(entities){  
  
    $("#cargando").css("visibility","visible");

    return new Promise((resolve, reject) => { 

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
          
            if(store.apiDataSources[i].varName=="abasto"){
               
                serviceName=store.apiDataSources[i].serviceName+"?";
                apiURL=store.apiDataSources[i].apiURL;
            }

        }

        if(store.map_var==kpiExpert_OOS_Filiales){               
                
            serviceName ="getSP/Generico?spname=VIS_Calcular_KPI_Abasto_OOSFiliales&";       

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

            console.log(params);

            //FILTRO DE MASIVO
            if($("#masivos_cb").val() == "Todos" || $("#masivos_cb").val() == ""){

                params+="&masivos=Todos";               

            }else if($("#masivos_cb").val() == "SinMasivos"){

                params+="&masivos=Sin Masivos"; 

            }else if($("#masivos_cb").val() == "SoloMasivos"){

                params+="&masivos=Solo Masivos"; 
                
            } 


            //**** */

            var URL=apiURL+"/"+serviceName+"fechaInicio="+dateInit_+"&fechaFin="+dateEnd_+"&agrupador="+agrupador+""+params;
            console.log(URL);
            if(URL.indexOf("undefined" < 0)){
                d3.json(URL, function (error, data) {

                    $("#cargando").css("visibility","hidden");

                    
                    if(error){
                        alert("Error API Abasto",error);
                        resolve();
                        return;
                    }

                    if(data.error){
                        alert("Error API Abasto",data.error);
                        resolve();
                        return;
                    }

                    console.log("abasto",data.recordset);

                    var entities_coll={};
                    
                    for(var i=0;  i < entities.length; i++){ 

                        entities[i].abasto={VolumenPlan:0,VolumenReal:0,VolPlan_Peso:0,VolReal_Peso:0, abasto:undefined,Pct_Radar:0, values:[]};
                        entities_coll[entities[i].key]=entities[i];                       

                    }   
                    
                    var sumaZapo=0;

                    store.abasto=[];
                        
                    for(var j=0;  j < data.recordset.length; j++){

                        var entidad=entities_coll[data.recordset[j].Agrupador];

                        if(entities_coll[ diccionarioNombres[ data.recordset[j].Agrupador ]] && !entidad){
                            entidad=entities_coll[ diccionarioNombres[ data.recordset[j].Agrupador ]];
                        }
                        
                        if( entidad ){

                            entidad.abasto.VolumenPlan+=Number(data.recordset[j].VolumenPlan);
                            entidad.abasto.VolumenReal+=Number(data.recordset[j].VolumenReal);
                            entidad.abasto.VolPlan_Peso+=Number(data.recordset[j].VolPlan_Peso);
                            entidad.abasto.VolReal_Peso+=Number(data.recordset[j].VolReal_Peso);
                            entidad.abasto.Pct_Radar+=Number(data.recordset[j].Pct_Radar);                                              

                            entidad.abasto.values.push(data.recordset[j]);  
                            
                            entidad.abasto.abasto=Math.round((entidad.abasto.Pct_Radar/entidad.abasto.values.length)*1000)/10;                                                           

                        }else{
                            if(data.recordset[j].Agrupador!=null)
                                console.log("no existe entidad mencionada en abasto:",data.recordset[j].Agrupador);
                        }     
                        
                        //Guarda todos los datos de abasto recibidos en el store sin agrupar por entidad, para poder crear ventana de detalle de U.N.
                        store.abasto.push(data.recordset[j]);

                    }                                    

                    resolve();

                });
            }
        }else{
            alert("Error al encontrar URL API Abasto");
            resolve();
        }  

    });

}


calculateKpiExpert_Abasto.getTooltipDetail=function(entityId){       


    for(var i=0;  i < entities.length; i++){

    
        if(entities[i].key.toLowerCase()==entityId.toLowerCase()){

            var abastoPer="Sin Dato";

            if(entities[i].abasto){

                if(entities[i].abasto.abasto!=undefined)
                abastoPer=entities[i].abasto.abasto+"%";
                
                if(entities[i].abasto.abasto > 130)
                    abastoPer=">130%";
                
                var text=`<div class="tooltipDetailElement"><img id="" src="images/cump_abasto.png" style=""></img>
                <span style='color:#ffffff;font-size:${15*escalaTextos}px;'>Cumplimiento de Abasto: </span><br>
                <span style='color:#fff600;font-size:${15*escalaTextos}px;'></span> <span style='color:#ffffff'>${abastoPer} <span style='color:#ffffff;font-size:${12*escalaTextos}px;'> (Plan: ${formatNumber(entities[i].abasto.VolPlan_Peso)} TM , Real:${formatNumber(entities[i].abasto.VolReal_Peso)} TM)</span>
                </div>`

                return text;

            }
        }
            
    }
}



calculateKpiExpert_Abasto.downloadCSV=function(entityId){

    for(var i=0;  i < entities.length; i++){

            if(entities[i].key == entityId){

                var csv = 'Agrupador,DescrProducto,Destino,Origen,Pct_Radar,Peso,Transporte,VolumenPlan,VolumenReal\n';

                var LLaves=["Agrupador","DescrProducto","Destino","Origen","Pct_Radar","Peso","Transporte","VolumenPlan","VolumenReal"];

                    //merge the data with CSV

                        for(var j=0;  j < entities[i].abasto.values.length; j++){

                            for(var k=0;  k < LLaves.length; k++){
                                    csv +=entities[i].abasto.values[j][LLaves[k]]+',';
                            }

                            csv += "\n";
                    };

                    var hiddenElement = document.createElement('a');

                    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
                    hiddenElement.target = '_blank';

                    hiddenElement.download = 'Abasto nivel_'+$("#nivel_cb").val()+' '+entityId+' '+$('#datepicker').val()+' al '+$('#datepicker2').val()+' .csv';
                    hiddenElement.click();

            }

    }

}