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
        
        if(i < 100){

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

        $("#toolTip2").css("visibility","hidden");
        $("#toolTip3").css("visibility","hidden");
       
       
}


kpiExpert_FR.DrawTooltipDetail=function(entity){   

        d3.select("#svgTooltip").selectAll(".frDetail").data([]).exit().remove();
        d3.select("#svgTooltip3").selectAll(".frDetail").data([]).exit().remove();

        kpiExpert_FR.DrawTooltipDetail_Estado(entity);
        kpiExpert_FR.DrawTooltipDetail_ByDay(entity);

       

}

kpiExpert_FR.DrawTooltipDetail_Estado=function(entity){ 

        var maximo=0;

        var arr=d3.nest()
            .key(function(d) { return d.EstadoZTDem; })
            .entries(entity.values);  

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

                if(maximo < arr[i].CantEntfinal){
                        maximo=arr[i].CantEntfinal;
                } 
                
                arr[i].por1=Math.round((arr[i].vol1/arr[i].totalSolicitado)*100);
                arr[i].por2=Math.round((arr[i].vol2/arr[i].totalSolicitado)*100);
                arr[i].por3=Math.round((arr[i].vol3/arr[i].totalSolicitado)*100);      

        }

        arr = arr.sort((a, b) => {                
                return b.CantEntfinal - a.CantEntfinal;                                    

        }); 

        arr=arr.reverse();

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
        $("#toolTip3").css("right",20+"px");




        /* 

        VIX_TT  : Prepara datos para el tool tip

        */


    // DATOS 

    var data = arr.map(function(item) {
        return {
          key: item.key,
          "por1": item.por1,      
          "cant": item.CantEntfinal
        };
        });
    
    
        // DEFINE COLUMNAS
      
      var columns = [
        { key: "key", header: "Estado", sortable: true, width: "100px" },
        { key: "por1", header: "Fill Rate", sortable: true, width: "200px" },    
        { key: "cant", header: "Vol. Entregado", sortable: true, width: "200px" },
        ];
    
    
       // DEFINE VISITORS PARA CADA COLUMNA
    
    
      var columnVisitors = {
        key: function(value,i) {
            return `<div class="key-selector" onclick="filterControls.lookForEntity('${value}')">${value}
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
                var ancho=GetValorRangos( arr[i].CantEntfinal,1, maximo ,1,svgTooltipHeight*.4);
                var barValue = Math.round((arr[i].CantEntfinal/1000)*100)/100 +"k";
               
              

                return '<div class="bar-container">' +
                '<svg width="100%" height="10"><rect class="bar-rect" width="' + ancho + '" height="10" style="fill: white;"></rect></svg>' +
                '<span class="bar-value">' + barValue + '</span>' +
                '</div>';



                
        }
      };

      // COLUMNAS CON TOTALES :

      var columnsWithTotals = ['cant']; 
      var totalsColumnVisitors = {
                'cant': function(value) { 
                        var v = Math.round((value/1000)*100)/100 +"k";
             
                        return v; 
                },
                //'column2': function(value) { return '$' + value.toFixed(2); }
                };

    
    
      // FORMATEA DIV :
    
      vix_tt_formatToolTip("#toolTip3","FillRate por Estado",600);
    
      // CREA TABLA USANDO DATOS
    
      vix_tt_table_extended(data, columns, columnVisitors, totalsColumnVisitors, "toolTip3", columnsWithTotals );
      
      
      // APLICA TRANSICIONES 
    
      vix_tt_transitionRectWidth("toolTip3");
      


}
    
kpiExpert_FR.DrawTooltipDetail_ByDay=function(entity){    
    
        console.log(entity);  
       
        var maximo=0;

        var arr=d3.nest()
                .key(function(d) { 

                        if(d.fecha){
                                return d.fecha.getTime(); 
                        }else{                       
                                return 0;
                        }                        
        
                })
                .entries(entity.values);

        
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

                        if(maximo < arr[i].CantEntfinal){
                                maximo=arr[i].CantEntfinal;
                        } 
                        
                        arr[i].por1=Math.round((arr[i].vol1/arr[i].totalSolicitado)*100);
                        arr[i].por2=Math.round((arr[i].vol2/arr[i].totalSolicitado)*100);
                        arr[i].por3=Math.round((arr[i].vol3/arr[i].totalSolicitado)*100);            

        } 
        
        arr = arr.sort((a, b) => {                
                        return b.fecha - a.fecha;                                    
        
        }); 
        
        arr=arr.reverse();

        var ancho=20;
        var caso=0;
       
        
        var svgTooltipWidth=arr.length*ancho;
        if(svgTooltipWidth < 80)
        svgTooltipWidth=80;
    
        var svgTooltipHeight=500;
        var marginBottom=svgTooltipHeight*.11;
        var tamanioFuente=ancho*.8;   
    
        $("#toolTip2").css("visibility","visible");            
        $("#toolTip2").css("left",(mouse_x+300)+"px");
           
      
        // ADD ON PARA USAR EL FORMATEADOR DE TOOLTIPS ---------------------------------------------------


        // FORMATEA TOOL TIP :
    
        vix_tt_formatToolTip("#toolTip2","Detalle de Días de FR de "+entity.key,svgTooltipWidth);

        // Agrega un div con un elemento svg :

        var svgElement = "<svg id='svgTooltip' style='pointer-events:none;'></svg>";
        d3.select("#toolTip2").append("div").html(svgElement);


        // Continua con la Generacion de las graficas dentro del svgTooltip

        // -------------------------------------------------------------------------------------------------

    
        d3.select("#svgTooltip")                     
                    .style("width", svgTooltipWidth )
                    .style("height", svgTooltipHeight )
                    ;
                    var posY=mouse_y+50;

        if( $("#svgTooltip").height()+mouse_y+50 > windowHeight ){
                posY=windowHeight-($("#svgTooltip").height()+20);
        }

        var posY=mouse_y-50;

        

        if( posY < 0 ){
                posY=50;
        }

      
       
        for(var i=0; i < arr.length; i++ ){        
                
                var altura=svgTooltipHeight*.3;
                var altura1=GetValorRangos( arr[i].por1,1, 100 ,1,altura);
                var altura2=GetValorRangos( arr[i].por2,1, 100 ,1,altura);
                var altura3=GetValorRangos( arr[i].por3,1, 100 ,1,altura);
              
          
                d3.select("#svgTooltip").append("rect")		    		
                                            .attr("width",ancho )
                                            .attr("class","frDetail")
                                            .attr("x",ancho*caso  )
                                            .attr("y", (svgTooltipHeight)-altura-3-marginBottom  )
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
                                            .attr("y", (svgTooltipHeight)-altura1-3-marginBottom  )
                                            .attr("height",1)
                                            .attr("fill","#00A8FF")
                                            .transition().delay(0).duration(i*50)
                                            .style("height",altura1 )	
                                            ;

                d3.select("#svgTooltip").append("rect")		    		
                                            .attr("width",ancho*.6 )
                                            .attr("class","frDetail")
                                            .attr("x",(ancho*caso)+(ancho*.1)  )
                                            .attr("y", (svgTooltipHeight)-altura1-altura2-3-marginBottom  )
                                            .attr("height",1)
                                            .attr("fill","#EAFF00")
                                            .transition().delay(0).duration(i*50)
                                            .style("height",altura2 )	
                                            ;

                 d3.select("#svgTooltip").append("rect")		    		
                                            .attr("width",ancho*.6 )
                                            .attr("class","frDetail")
                                            .attr("x",(ancho*caso)+(ancho*.1)  )
                                            .attr("y", (svgTooltipHeight)-altura1-altura2-altura3-3-marginBottom  )
                                            .attr("height",1)
                                            .attr("fill","#FF0000")
                                            .transition().delay(0).duration(i*50)
                                            .style("height",altura3 )	
                                            ;


                var alturaVolumen=GetValorRangos( arr[i].CantEntfinal,1, maximo ,1,svgTooltipHeight*.3);

                d3.select("#svgTooltip").append("rect")		    		
                                        .attr("width",(ancho*.7) )
                                        .attr("class","frDetail")
                                        .attr("x", ancho*caso  )
                                        .attr("y", (svgTooltipHeight*.5)-alturaVolumen-3  )
                                        .attr("height",alturaVolumen)
                                        .attr("fill","#FFFFFF")                                     
                                        .transition().delay(0).duration(i*50)
                                        .style("height",alturaVolumen )	
                                        ;

        
    
                d3.select("#svgTooltip")
                        .append("text")						
                        .attr("class","frDetail")
                        .style("fill","#ffffff")		
                        .style("font-family","Cabin")
                        .style("font-weight","bold")
                        .style("font-size",tamanioFuente*.8)						
                        .style("text-anchor","start")
                        .style("opacity",0 )
                        .attr("transform"," translate("+String( ancho*caso+(tamanioFuente*.7)+3  )+","+String( ((svgTooltipHeight*.6))-marginBottom-alturaVolumen  )+")  rotate("+(-90)+") ")
                        .text(function(){
                        
                            return  Math.round((arr[i].CantEntfinal/1000)*100)/100 +"k";
    
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
                      .attr("transform"," translate("+String( ancho*caso+(tamanioFuente*.8)+1  )+","+String( (svgTooltipHeight-50)-marginBottom )+")  rotate("+(-90)+") ")
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
                                .attr("transform"," translate("+String( ancho*caso+(tamanioFuente*.7)  )+","+String( (svgTooltipHeight)-marginBottom+10  )+")  rotate("+(-90)+") ")
                                .text(function(){
                                        
                                var date=new Date( Number(arr[i].key) );

                                return  date.getDate()+" "+getMes(date.getMonth());
        
                                });
    
                        caso++;            
        }         
    
    }

    kpiExpert_FR.DrawMainHeader=function(){

                kpiExpert_FR.ancho=windowWidth*.7;

                kpiExpert_FR.offSetLeft=168;
                kpiExpert_FR.offSetLeft2=350;
                kpiExpert_FR.offSetTop=46;              

                kpiExpert_FR.altura=35;

                var ancho=kpiExpert_FR.ancho;
                var offSetLeft=kpiExpert_FR.offSetLeft;
                var offSetTop=kpiExpert_FR.offSetTop;
                ancho=kpiExpert_FR.ancho;

                var altura=kpiExpert_FR.altura;
                
                svgLines.selectAll(".encabezado").data([]).exit().remove();

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

				return "Nacional Entregado: "+Math.round((totalCanEnt_ref/totalCanSol_ref)*100)+"%, "+formatNumber(Math.round(totalCanEnt_ref/1000) )+" k  ";

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

				return "Solicitado: "+formatNumber(Math.round(totalCanSol_ref/1000) )+" k ";

			}).transition().delay(0).duration(1000)
                        .style("opacity",1 );

    }


        kpiExpert_FR.DrawFilteredHeader=function(){

                svgLines.selectAll(".encabezadoFiltered").data([]).exit().remove();

                if( (store.fillRate.length==store.dataToDraw.length) )
                return;

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
                
                var ancho2 = GetValorRangos( vol1_filtered ,1, totalCanSol_ref , 1,kpiExpert_FR.ancho);

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
                        .attr("rx",4)
                        .attr("width",1 )
                        .attr("height",(altura*.4) )
                        .attr("x",kpiExpert_FR.offSetLeft+6+kpiExpert_FR.offSetLeft2)
                        .attr("y",kpiExpert_FR.offSetTop+5+(altura*.18))
                        .transition().delay(0).duration(1000)
                        .style("width",ancho2-3 )
                        ;

                        
                
                // AMARILLO        

                var ancho3 = GetValorRangos( vol2_filtered ,1, totalCanSol_ref , 1,kpiExpert_FR.ancho);

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
                        .attr("rx",4)
                        .attr("width",1 )
                        .attr("height",(altura*.4) )
                        .attr("x",kpiExpert_FR.offSetLeft+ancho2+6+kpiExpert_FR.offSetLeft2 )
                        .attr("y",kpiExpert_FR.offSetTop+5+(altura*.18))
                        .transition().delay(1000).duration(1000)
                        .attr("width",ancho3-3 )
                        ;        

                // ROJO

                var ancho4 = GetValorRangos( vol3_filtered ,1, totalCanSol_ref , 1,kpiExpert_FR.ancho);

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
                        .attr("rx",4)
                        .attr("width",1 )
                        .attr("height",(altura*.4) )
                        .attr("x",kpiExpert_FR.offSetLeft+ancho2+ancho3+6+kpiExpert_FR.offSetLeft2)
                        .attr("y",kpiExpert_FR.offSetTop+5+(altura*.18))
                        .transition().delay(2000).duration(1000)
                        .attr("width",ancho4-3 )
                        ;
                
                //CIRCULO Y LIENA

                svgLines				
                        .append("circle")
                        .attr("class","encabezadoFiltered")
                        .attr("fill","#ffffff")
                        .attr("cx",kpiExpert_FR.offSetLeft+ancho2+ancho3+ancho4+3+kpiExpert_FR.offSetLeft2 )
                        .attr("cy",kpiExpert_FR.offSetTop+11+(altura*.18))                   
                        .attr("r",3);
                /*
                svgLines.append("line")
                        .style("stroke","#ffffff" )
                        .attr("class","encabezadoFiltered ")
                        .style("stroke-width", 1 )
                        .style("stroke-opacity", 1 )
                        .attr("x1",kpiExpert_FR.offSetLeft+ancho2+ancho3+ancho4+3 )
                        .attr("y1",kpiExpert_FR.offSetTop+15+(altura*.4))
                        .attr("x2",kpiExpert_FR.offSetLeft+ancho2+ancho3+ancho4+3 )
                        .attr("y2",kpiExpert_FR.offSetTop+45+(altura*.4));
*/

                // ENTREGADO **********
        
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
                        .attr("y", kpiExpert_FR.offSetTop+35+(altura*.5))  
                        .text(function(){
                                
                                //return "Muestra Solicitado: "+formatNumber(Math.round(totalCanSol_filtered/1000) )+" k Ton - Entregado: "+formatNumber(Math.round(totalCanEnt_filtered/1000) )+" k Ton ("+ Math.round((totalCanEnt_filtered/totalCanSol_filtered)*100) +"%)";
                                return "Muestra Entregado: "+Math.round((totalCanEnt_filtered/totalCanSol_filtered)*100)+"% , "+formatNumber(Math.round(totalCanEnt_filtered/1000) )+" k  - Solictidado: "+formatNumber(Math.round(totalCanSol_filtered/1000) )+" k  ";

                        })
                        .transition().delay(0).duration(1000)
                        .style("opacity",1 );

                
                // TEXTO AZUL

                svgLines.append("text")							
                        .style("fill","#00A8FF")		
                        .attr("class","encabezadoFiltered")					
                        .style("opacity",0)
                        .style("font-family","Cabin")
                        .style("font-weight","normal")
                        .style("font-size",12*escalaTextos)						
                        .style("text-anchor","start")
                        .attr("x", kpiExpert_FR.offSetLeft+ancho2+ancho3+ancho4-3+kpiExpert_FR.offSetLeft2 -(7*(escalaTextos*13) ))
                        .attr("y", kpiExpert_FR.offSetTop+50+(altura*.5))  
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
                        .style("text-anchor","start")
                        .attr("x", kpiExpert_FR.offSetLeft+ancho2+ancho3+ancho4+kpiExpert_FR.offSetLeft2)
                        .attr("y", kpiExpert_FR.offSetTop+50+(altura*.5))  
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
                        .style("text-anchor","start")
                        .attr("x", kpiExpert_FR.offSetLeft+ancho2+ancho3+ancho4+3+kpiExpert_FR.offSetLeft2+(7*(escalaTextos*13) ))
                        .attr("y", kpiExpert_FR.offSetTop+50+(altura*.5))  
                        .text(function(){
                                
                                return "3 Días o mas: "+por3_filtered+"%";

                        })
                        .transition().delay(0).duration(1000)
                        .style("opacity",1 );
                        

 }
    