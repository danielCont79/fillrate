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
    $("#toolTip5").css("left",10+"%");
    $("#toolTip5").css("top",5+"%");

    vix_tt_formatToolTip("#toolTip5","Destinos de Abasto desde "+toTitleCase(entity.key),700);

    $("#toolTip5").append("<svg id='svgTooltip5' ></svg> ");

    d3.select("#svgTooltip5")                     
                .style("width", svgTooltipWidth )
                .style("height", (svgTooltipHeight)+50+"px" )
                ;


         d3.select("#svgTooltip5")
                .append("text")						
                .attr("class","abasDetail")
                .style("fill","#8EBBFF")		
                .style("font-family","Cabin")
                .style("font-weight","bold")
                .style("font-size",tamanioFuente)						
                .style("text-anchor","start")
                .style("opacity",1 )
                .attr("transform"," translate("+String( svgTooltipWidth*.2  )+","+String( tamanioFuente+10   )+")  rotate("+(0)+") ")
                .text("Vol. Plan")
                .transition().delay(0).duration(i*50);
        
        d3.select("#svgTooltip5")
                .append("text")						
                .attr("class","abasDetail")
                .style("fill","#8EBBFF")		
                .style("font-family","Cabin")
                .style("font-weight","bold")
                .style("font-size",tamanioFuente)						
                .style("text-anchor","start")
                .style("opacity",1 )
                .attr("transform"," translate("+String( svgTooltipWidth*.4  )+","+String( tamanioFuente+10  )+")  rotate("+(0)+") ")
                .text("Vol. Real")
                .transition().delay(0).duration(i*50);
        
        
        d3.select("#svgTooltip5")
                .append("text")						
                .attr("class","abasDetail")
                .style("fill","#8EBBFF")		
                .style("font-family","Cabin")
                .style("font-weight","bold")
                .style("font-size",tamanioFuente)						
                .style("text-anchor","start")
                .style("opacity",1 )
                .attr("transform"," translate("+String( svgTooltipWidth*.55  )+","+String( tamanioFuente+10   )+")  rotate("+(0)+") ")
                .text("Dif (k)")
                .transition().delay(0).duration(i*50);
        
        d3.select("#svgTooltip5")
                .append("text")						
                .attr("class","abasDetail")
                .style("fill","#8EBBFF")		
                .style("font-family","Cabin")
                .style("font-weight","bold")
                .style("font-size",tamanioFuente)						
                .style("text-anchor","start")
                .style("opacity",1 )
                .attr("transform"," translate("+String( svgTooltipWidth*.7  )+","+String( tamanioFuente+10   )+")  rotate("+(0)+") ")
                .text("Dif (%)")
                .transition().delay(0).duration(i*50);
        
        d3.select("#svgTooltip5")
                .append("text")						
                .attr("class","abasDetail")
                .style("fill","#8EBBFF")		
                .style("font-family","Cabin")
                .style("font-weight","bold")
                .style("font-size",tamanioFuente)						
                .style("text-anchor","start")
                .style("opacity",1 )
                .attr("transform"," translate("+String( svgTooltipWidth*.9  )+","+String( tamanioFuente+10   )+")  rotate("+(0)+") ")
                .text("Vol. Real")
                .transition().delay(0).duration(i*50); 



        for(var i=0; i < arr.length; i++ ){
            
            if(arr[i].CantEntFinalProp==0)
            continue;
        
            var ancho=GetValorRangos( arr[i].VolumenReal ,1, maximo ,1,svgTooltipWidth*.11 );

            d3.select("#svgTooltip5").append("rect")		    		
                        .attr("width",1 )
                        .attr("class","abasDetail")
                        .attr("x",svgTooltipWidth*.9     )
                        .attr("y", (altura*caso)+marginTop )
                        .attr("height",altura*.4)
                        .attr("fill","#FFFE97")
                        .transition().delay(0).duration(1000)
                        .attr("width",ancho )
                        ; 


            //BARRA 2

            var anchoVol=GetValorRangos( arr[i].DifPer*1000,1, maximoVolumen ,1,svgTooltipWidth*.11 );

            d3.select("#svgTooltip5").append("rect")		    		
                        .attr("width",1 )
                        .attr("class","abasDetail")
                        .attr("x",svgTooltipWidth*.7    )
                        .attr("y", (altura*caso)+marginTop )
                        .attr("height",altura*.4)
                        .attr("fill","#ffffff")
                        .transition().delay(0).duration(1000)
                        .attr("width",anchoVol)	
                        ;       

            d3.select("#svgTooltip5")
                    .append("text")						
                    .attr("class","abasDetail")
                    .style("fill","#ffffff")		
                    .style("font-family","Cabin")
                    .style("font-weight","bold")
                    .style("font-size",tamanioFuente)						
                    .style("text-anchor","start")
                    .style("opacity",0 )
                    .attr("transform"," translate("+String( (svgTooltipWidth*.7)+anchoVol+2   )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                    .text(function(){
                    
                        return Math.round( arr[i].DifPer*1000)/10+"%";
                    })
                    .transition().delay(0).duration(1000)
                    .style("opacity",1 )
                    ;


            // SEPARADAS
            
            d3.select("#svgTooltip5")
                    .append("text")						
                    .attr("class","abasDetail")
                    .style("fill","#ffffff")		
                    .style("font-family","Cabin")
                    .style("font-weight","bold")
                    .style("font-size",tamanioFuente)						
                    .style("text-anchor","start")
                    .style("opacity",0 )
                    .attr("transform"," translate("+String( svgTooltipWidth*.2 )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                    .text(function(){                 
                    
                        return formatNumber(Math.round(arr[i].VolumenPlan));

                    })
                    .transition().delay(0).duration(i*50)
                    .style("opacity",1 )
                    ;

            d3.select("#svgTooltip5")
                    .append("text")						
                    .attr("class","ventasDetail")
                    .style("fill","#ffffff")		
                    .style("font-family","Cabin")
                    .style("font-weight","bold")
                    .style("font-size",tamanioFuente)						
                    .style("text-anchor","start")
                    .style("opacity",0 )
                    .attr("transform"," translate("+String( svgTooltipWidth*.4  )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                    .text(function(){
                    
                        return formatNumber(Math.round(arr[i].VolumenReal));

                    })
                    .transition().delay(0).duration(i*50)
                    .style("opacity",1 )
                ;
                
            d3.select("#svgTooltip5")
                .append("text")						
                .attr("class","ventasDetail")
                .style("fill","#ffffff")		
                .style("font-family","Cabin")
                .style("font-weight","bold")
                .style("font-size",tamanioFuente)						
                .style("text-anchor","start")
                .style("opacity",0 )
                .attr("transform"," translate("+String( svgTooltipWidth*.55  )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                .text(function(){
                
                    return formatNumber(Math.round(arr[i].Dif));

                })
                .transition().delay(0).duration(i*50)
                .style("opacity",1 )
                ;           


            d3.select("#svgTooltip5")
                        .append("text")						
                        .attr("class","abasDetail")
                        .style("fill","#ffffff")		
                        .style("font-family","Cabin")
                        .style("font-weight","bold")
                        .style("font-size",tamanioFuente)	
                        .style("text-anchor","start")
                        .style("pointer-events","auto")
                        .attr("transform"," translate("+String( 5  )+","+String( altura*caso+(tamanioFuente )+marginTop   )+")  rotate("+(0)+") ")
                        .text(function(){

                            this.name=arr[i].key;
                            return  arr[i].key;

                        })
                        .on("mouseover",function(){
                            d3.select(this).style("fill","#F0FF00");
                            
                        })
                        .on("mouseout",function(){
                                d3.select(this).style("fill","#FFFFFF");
                                
                        })
                        .on("click",function(){
                                
                            kpiExpert_ABAS.eraseChart();

                            if(filterControls){
                                    filterControls.lookForEntity(this.name);
                            }
                                
                        });

                        caso++;
            
        }   
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

       


    vix_tt_formatToolTip("#toolTip2","Abasto por Tipo de Transporte",600);

    $("#toolTip2").append("<svg id='svgTooltip' ></svg> ");    

    $("#toolTip2").css("visibility","visible");            
    $("#toolTip2").css("top","70%");
    $("#toolTip2").css("right","50px");  
    
    d3.select("#svgTooltip")                     
    .style("width", svgTooltipWidth )
    .style("height", svgTooltipHeight+40 )
    ;


    d3.select("#svgTooltip")
    .append("text")						
    .attr("class","abasDetail")
    .style("fill","#8EBBFF")		
    .style("font-family","Cabin")
    .style("font-weight","bold")
    .style("font-size",tamanioFuente)						
    .style("text-anchor","start")
    .style("opacity",1 )
    .attr("transform"," translate("+String( svgTooltipWidth*.2  )+","+String( tamanioFuente+10  )+")  rotate("+(0)+") ")
    .text("Vol. Plan")
    .transition().delay(0).duration(i*50);

    d3.select("#svgTooltip")
    .append("text")						
    .attr("class","abasDetail")
    .style("fill","#8EBBFF")		
    .style("font-family","Cabin")
    .style("font-weight","bold")
    .style("font-size",tamanioFuente)						
    .style("text-anchor","start")
    .style("opacity",1 )
    .attr("transform"," translate("+String( svgTooltipWidth*.4  )+","+String( tamanioFuente+10   )+")  rotate("+(0)+") ")
    .text("Vol. Real")
    .transition().delay(0).duration(i*50);


    d3.select("#svgTooltip")
    .append("text")						
    .attr("class","abasDetail")
    .style("fill","#8EBBFF")		
    .style("font-family","Cabin")
    .style("font-weight","bold")
    .style("font-size",tamanioFuente)						
    .style("text-anchor","start")
    .style("opacity",1 )
    .attr("transform"," translate("+String( svgTooltipWidth*.55  )+","+String( tamanioFuente+10   )+")  rotate("+(0)+") ")
    .text("Dif ")
    .transition().delay(0).duration(i*50);

    d3.select("#svgTooltip")
    .append("text")						
    .attr("class","abasDetail")
    .style("fill","#8EBBFF")		
    .style("font-family","Cabin")
    .style("font-weight","bold")
    .style("font-size",tamanioFuente)						
    .style("text-anchor","start")
    .style("opacity",1 )
    .attr("transform"," translate("+String( svgTooltipWidth*.7  )+","+String( tamanioFuente+10   )+")  rotate("+(0)+") ")
    .text("Dif (%)")
    .transition().delay(0).duration(i*50);

    d3.select("#svgTooltip")
    .append("text")						
    .attr("class","abasDetail")
    .style("fill","#8EBBFF")		
    .style("font-family","Cabin")
    .style("font-weight","bold")
    .style("font-size",tamanioFuente)						
    .style("text-anchor","start")
    .style("opacity",1 )
    .attr("transform"," translate("+String( svgTooltipWidth*.9  )+","+String(tamanioFuente+10   )+")  rotate("+(0)+") ")
    .text("Vol. Real")
    .transition().delay(0).duration(i*50); 

 
    for(var i=0; i < arr.length; i++ ){
    
        
        if(arr[i].CantEntFinalProp==0)
        continue;
    
        var ancho=GetValorRangos( arr[i].VolumenReal,1, maximo ,1,svgTooltipWidth*.11 );

        d3.select("#svgTooltip").append("rect")		    		
					.attr("width",1 )
                    .attr("class","abasDetail")
					.attr("x",svgTooltipWidth*.9     )
					.attr("y", (altura*caso)+marginTop )
					.attr("height",altura*.4)
					.attr("fill","#FFFE97")
                    .transition().delay(0).duration(1000)
					.attr("width",ancho )
					;        

        //BARRA 2

        var anchoVol=GetValorRangos( arr[i].DifPer*1000,1, maximoVolumen ,1,svgTooltipWidth*.11 );

        d3.select("#svgTooltip").append("rect")		    		
                    .attr("width",1 )
                    .attr("class","abasDetail")
                    .attr("x",svgTooltipWidth*.7    )
                    .attr("y", (altura*caso)+marginTop )
                    .attr("height",altura*.4)
                    .attr("fill","#ffffff")
                    .transition().delay(0).duration(1000)
                    .attr("width",anchoVol)	
                    ;       

        d3.select("#svgTooltip")
                  .append("text")						
                  .attr("class","abasDetail")
                  .style("fill","#ffffff")		
                  .style("font-family","Cabin")
                  .style("font-weight","bold")
                  .style("font-size",tamanioFuente)						
                  .style("text-anchor","start")
                  .style("opacity",0 )
                  .attr("transform"," translate("+String( (svgTooltipWidth*.7)+anchoVol+2   )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                  .text(function(){
                  
                      return Math.round( arr[i].DifPer*1000)/10+"%";
                  })
                  .transition().delay(0).duration(1000)
                  .style("opacity",1 )
                ;


        
        d3.select("#svgTooltip")
                  .append("text")						
                  .attr("class","abasDetail")
                  .style("fill","#ffffff")		
                  .style("font-family","Cabin")
                  .style("font-weight","bold")
                  .style("font-size",tamanioFuente)						
                  .style("text-anchor","start")
                  .style("opacity",0 )
                  .attr("transform"," translate("+String( svgTooltipWidth*.2 )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                  .text(function(){                 
                   
                    return formatNumber(Math.round(arr[i].VolumenPlan));

                  })
                  .transition().delay(0).duration(i*50)
                  .style("opacity",1 )
                ;

        d3.select("#svgTooltip")
                .append("text")						
                .attr("class","ventasDetail")
                .style("fill","#ffffff")		
                .style("font-family","Cabin")
                .style("font-weight","bold")
                .style("font-size",tamanioFuente)						
                .style("text-anchor","start")
                .style("opacity",0 )
                .attr("transform"," translate("+String( svgTooltipWidth*.4  )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                .text(function(){
                
                    return formatNumber(Math.round(arr[i].VolumenReal));

                })
                .transition().delay(0).duration(i*50)
                .style("opacity",1 )
              ;
              
        d3.select("#svgTooltip")
              .append("text")						
              .attr("class","ventasDetail")
              .style("fill","#ffffff")		
              .style("font-family","Cabin")
              .style("font-weight","bold")
              .style("font-size",tamanioFuente)						
              .style("text-anchor","start")
              .style("opacity",0 )
              .attr("transform"," translate("+String( svgTooltipWidth*.55  )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
              .text(function(){
              
                return formatNumber(Math.round(arr[i].Dif),true);


              })
              .transition().delay(0).duration(i*50)
              .style("opacity",1 )
            ;


        d3.select("#svgTooltip")
                    .append("text")						
                    .attr("class","abasDetail")
                    .style("fill","#ffffff")		
                    .style("font-family","Cabin")
                    .style("font-weight","bold")
                    .style("font-size",tamanioFuente)	
                    .style("text-anchor","start")
                    .style("pointer-events","auto")
                    .attr("transform"," translate("+String( 5  )+","+String( altura*caso+(tamanioFuente )+marginTop   )+")  rotate("+(0)+") ")
                    .text(function(){

                        this.name=arr[i].key;
                        return  arr[i].key;

                    })
                    .on("mouseover",function(){
                        d3.select(this).style("fill","#F0FF00");
                    
                    })
                    .on("mouseout",function(){
                            d3.select(this).style("fill","#FFFFFF");
                            
                    })
                    .on("click",function(){
                            
                        kpiExpert_ABAS.eraseChart();

                        if(filterControls){
                                filterControls.lookForEntity(this.name);
                        }
                            
                    });

                    caso++;        
    }    

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
        $("#toolTip3").css("left","5%");
        $("#toolTip3").css("top","10%");        

        vix_tt_formatToolTip("#toolTip3","Abasto a U.N. Entrega Final",700);

        $("#toolTip3").append("<svg id='svgTooltip3' ></svg> ");

        d3.select("#svgTooltip3")                     
                    .style("width", svgTooltipWidth )
                    .style("height", (svgTooltipHeight)+50+"px" )
                    ;

        d3.select("#svgTooltip3")
        .append("text")						
        .attr("class","abasDetail")
        .style("fill","#8EBBFF")		
        .style("font-family","Cabin")
        .style("font-weight","bold")
        .style("font-size",tamanioFuente)						
        .style("text-anchor","start")
        .style("opacity",1 )
        .attr("transform"," translate("+String( svgTooltipWidth*.2  )+","+String( tamanioFuente+10   )+")  rotate("+(0)+") ")
        .text("Vol. Plan")
        .transition().delay(0).duration(i*50);

        d3.select("#svgTooltip3")
        .append("text")						
        .attr("class","abasDetail")
        .style("fill","#8EBBFF")		
        .style("font-family","Cabin")
        .style("font-weight","bold")
        .style("font-size",tamanioFuente)						
        .style("text-anchor","start")
        .style("opacity",1 )
        .attr("transform"," translate("+String( svgTooltipWidth*.4  )+","+String( tamanioFuente+10  )+")  rotate("+(0)+") ")
        .text("Vol. Real")
        .transition().delay(0).duration(i*50);


        d3.select("#svgTooltip3")
        .append("text")						
        .attr("class","abasDetail")
        .style("fill","#8EBBFF")		
        .style("font-family","Cabin")
        .style("font-weight","bold")
        .style("font-size",tamanioFuente)						
        .style("text-anchor","start")
        .style("opacity",1 )
        .attr("transform"," translate("+String( svgTooltipWidth*.55  )+","+String( tamanioFuente+10   )+")  rotate("+(0)+") ")
        .text("Dif (k)")
        .transition().delay(0).duration(i*50);

        d3.select("#svgTooltip3")
        .append("text")						
        .attr("class","abasDetail")
        .style("fill","#8EBBFF")		
        .style("font-family","Cabin")
        .style("font-weight","bold")
        .style("font-size",tamanioFuente)						
        .style("text-anchor","start")
        .style("opacity",1 )
        .attr("transform"," translate("+String( svgTooltipWidth*.7  )+","+String( tamanioFuente+10   )+")  rotate("+(0)+") ")
        .text("Dif (%)")
        .transition().delay(0).duration(i*50);

        d3.select("#svgTooltip3")
        .append("text")						
        .attr("class","abasDetail")
        .style("fill","#8EBBFF")		
        .style("font-family","Cabin")
        .style("font-weight","bold")
        .style("font-size",tamanioFuente)						
        .style("text-anchor","start")
        .style("opacity",1 )
        .attr("transform"," translate("+String( svgTooltipWidth*.9  )+","+String( tamanioFuente+10   )+")  rotate("+(0)+") ")
        .text("Vol. Real")
        .transition().delay(0).duration(i*50); 



        for(var i=0; i < arr.length; i++ ){
            
            if(arr[i].CantEntFinalProp==0)
            continue;
        
            var ancho=GetValorRangos( arr[i].VolumenReal ,1, maximo ,1,svgTooltipWidth*.11 );

            d3.select("#svgTooltip3").append("rect")		    		
                        .attr("width",1 )
                        .attr("class","abasDetail")
                        .attr("x",svgTooltipWidth*.9     )
                        .attr("y", (altura*caso)+marginTop )
                        .attr("height",altura*.4)
                        .attr("fill","#FFFE97")
                        .transition().delay(0).duration(1000)
                        .attr("width",ancho )
                        ; 


            //BARRA 2

            var anchoVol=GetValorRangos( arr[i].DifPer*1000,1, maximoVolumen ,1,svgTooltipWidth*.11 );

            d3.select("#svgTooltip3").append("rect")		    		
                        .attr("width",1 )
                        .attr("class","abasDetail")
                        .attr("x",svgTooltipWidth*.7    )
                        .attr("y", (altura*caso)+marginTop )
                        .attr("height",altura*.4)
                        .attr("fill","#ffffff")
                        .transition().delay(0).duration(1000)
                        .attr("width",anchoVol)	
                        ;       

            d3.select("#svgTooltip3")
                    .append("text")						
                    .attr("class","abasDetail")
                    .style("fill","#ffffff")		
                    .style("font-family","Cabin")
                    .style("font-weight","bold")
                    .style("font-size",tamanioFuente)						
                    .style("text-anchor","start")
                    .style("opacity",0 )
                    .attr("transform"," translate("+String( (svgTooltipWidth*.7)+anchoVol+2   )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                    .text(function(){
                    
                        return Math.round( arr[i].DifPer*1000)/10+"%";
                    })
                    .transition().delay(0).duration(1000)
                    .style("opacity",1 )
                    ;


            // SEPARADAS
            
            d3.select("#svgTooltip3")
                    .append("text")						
                    .attr("class","abasDetail")
                    .style("fill","#ffffff")		
                    .style("font-family","Cabin")
                    .style("font-weight","bold")
                    .style("font-size",tamanioFuente)						
                    .style("text-anchor","start")
                    .style("opacity",0 )
                    .attr("transform"," translate("+String( svgTooltipWidth*.2 )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                    .text(function(){                 
                    
                        return formatNumber(Math.round(arr[i].VolumenPlan));

                    })
                    .transition().delay(0).duration(i*50)
                    .style("opacity",1 )
                    ;

            d3.select("#svgTooltip3")
                    .append("text")						
                    .attr("class","ventasDetail")
                    .style("fill","#ffffff")		
                    .style("font-family","Cabin")
                    .style("font-weight","bold")
                    .style("font-size",tamanioFuente)						
                    .style("text-anchor","start")
                    .style("opacity",0 )
                    .attr("transform"," translate("+String( svgTooltipWidth*.4  )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                    .text(function(){
                    
                        return formatNumber(Math.round(arr[i].VolumenReal));

                    })
                    .transition().delay(0).duration(i*50)
                    .style("opacity",1 )
                ;
                
            d3.select("#svgTooltip3")
                .append("text")						
                .attr("class","ventasDetail")
                .style("fill","#ffffff")		
                .style("font-family","Cabin")
                .style("font-weight","bold")
                .style("font-size",tamanioFuente)						
                .style("text-anchor","start")
                .style("opacity",0 )
                .attr("transform"," translate("+String( svgTooltipWidth*.55  )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                .text(function(){
                
                    return formatNumber(Math.round(arr[i].Dif));

                })
                .transition().delay(0).duration(i*50)
                .style("opacity",1 )
                ;           


            d3.select("#svgTooltip3")
                        .append("text")						
                        .attr("class","abasDetail")
                        .style("fill","#ffffff")		
                        .style("font-family","Cabin")
                        .style("font-weight","bold")
                        .style("font-size",tamanioFuente)	
                        .style("text-anchor","start")
                        .style("pointer-events","auto")
                        .attr("transform"," translate("+String( 5  )+","+String( altura*caso+(tamanioFuente )+marginTop   )+")  rotate("+(0)+") ")
                        .text(function(){

                            this.name=arr[i].key;
                            return  arr[i].key;

                        })
                        .on("mouseover",function(){
                            d3.select(this).style("fill","#F0FF00");
                            
                        })
                        .on("mouseout",function(){
                                d3.select(this).style("fill","#FFFFFF");
                                
                        })
                        .on("click",function(){
                                
                            kpiExpert_ABAS.eraseChart();

                            if(filterControls){
                                    filterControls.lookForEntity(this.name);
                            }
                                
                        });

                        caso++;
            
        }    

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


        var svgTooltipWidth=600;
        var marginLeft=svgTooltipWidth*.2;
        var tamanioFuente=altura*.4;
        var marginTop=35;

        $("#toolTip4").css("visibility","visible");          
        
        if( 4 == $("#nivel_cb").val() ){
            vix_tt_formatToolTip("#toolTip4","Orígenes de Abasto hacia "+toTitleCase(entity.key)+" Entrega Final",700);
        }else{
            vix_tt_formatToolTip("#toolTip4","Orígenes de Abasto hacia U.N. Entrega Final",700);
        }   
        

        $("#toolTip4").append("<svg id='svgTooltip4'  style='pointer-events:none;'></svg> ");

        d3.select("#svgTooltip4")                     
                    .style("width", svgTooltipWidth )
                    .style("height", (svgTooltipHeight)+50 )
                    ;

        $("#toolTip4").css("left","50%");
        $("#toolTip4").css("top","20%");

        // FORMATEA DIV :

    
        d3.select("#svgTooltip4")
            .append("text")						
            .attr("class","abasDetail")
            .style("fill","#8EBBFF")		
            .style("font-family","Cabin")
            .style("font-weight","bold")
            .style("font-size",tamanioFuente)						
            .style("text-anchor","start")
            .style("opacity",1 )
            .attr("transform"," translate("+String( svgTooltipWidth*.2  )+","+String( tamanioFuente+10   )+")  rotate("+(0)+") ")
            .text("Vol. Plan")
            .transition().delay(0).duration(i*50);

        d3.select("#svgTooltip4")
        .append("text")						
        .attr("class","abasDetail")
        .style("fill","#8EBBFF")		
        .style("font-family","Cabin")
        .style("font-weight","bold")
        .style("font-size",tamanioFuente)						
        .style("text-anchor","start")
        .style("opacity",1 )
        .attr("transform"," translate("+String( svgTooltipWidth*.4  )+","+String( tamanioFuente+10   )+")  rotate("+(0)+") ")
        .text("Vol. Real")
        .transition().delay(0).duration(i*50);


        d3.select("#svgTooltip4")
        .append("text")						
        .attr("class","abasDetail")
        .style("fill","#8EBBFF")		
        .style("font-family","Cabin")
        .style("font-weight","bold")
        .style("font-size",tamanioFuente)						
        .style("text-anchor","start")
        .style("opacity",1 )
        .attr("transform"," translate("+String( svgTooltipWidth*.55  )+","+String( tamanioFuente+10   )+")  rotate("+(0)+") ")
        .text("Dif")
        .transition().delay(0).duration(i*50);

        d3.select("#svgTooltip4")
        .append("text")						
        .attr("class","abasDetail")
        .style("fill","#8EBBFF")		
        .style("font-family","Cabin")
        .style("font-weight","bold")
        .style("font-size",tamanioFuente)						
        .style("text-anchor","start")
        .style("opacity",1 )
        .attr("transform"," translate("+String( svgTooltipWidth*.7  )+","+String( tamanioFuente+10   )+")  rotate("+(0)+") ")
        .text("Dif (%)")
        .transition().delay(0).duration(i*50);

        d3.select("#svgTooltip4")
        .append("text")						
        .attr("class","abasDetail")
        .style("fill","#8EBBFF")		
        .style("font-family","Cabin")
        .style("font-weight","bold")
        .style("font-size",tamanioFuente)						
        .style("text-anchor","start")
        .style("opacity",1 )
        .attr("transform"," translate("+String( svgTooltipWidth*.9  )+","+String(tamanioFuente+10   )+")  rotate("+(0)+") ")
        .text("Vol. Real")
        .transition().delay(0).duration(i*50); 

        for(var i=0; i < arr.length; i++ ){

                
            if(arr[i].CantEntFinalProp==0)
            continue;
        
            var ancho=GetValorRangos( arr[i].VolumenReal,1, maximo ,1,svgTooltipWidth*.11 );

            d3.select("#svgTooltip4").append("rect")		    		
                        .attr("width",1 )
                        .attr("class","abasDetail")
                        .attr("x",svgTooltipWidth*.9     )
                        .attr("y", (altura*caso)+marginTop )
                        .attr("height",altura*.4)
                        .attr("fill","#FFFE97")
                        .transition().delay(0).duration(1000)
                        .attr("width",ancho )
                        ;   

        
            //BARRA 2

            var anchoVol=GetValorRangos( arr[i].DifPer*1000,1, maximoVolumen ,1,svgTooltipWidth*.11 );

            d3.select("#svgTooltip4").append("rect")		    		
                        .attr("width",1 )
                        .attr("class","abasDetail")
                        .attr("x",svgTooltipWidth*.7    )
                        .attr("y", (altura*caso)+marginTop )
                        .attr("height",altura*.4)
                        .attr("fill","#ffffff")
                        .transition().delay(0).duration(1000)
                        .attr("width",anchoVol)	
                        ;       

                        d3.select("#svgTooltip4")
                        .append("text")						
                        .attr("class","abasDetail")
                        .style("fill","#ffffff")		
                        .style("font-family","Cabin")
                        .style("font-weight","bold")
                        .style("font-size",tamanioFuente)						
                        .style("text-anchor","start")
                        .style("opacity",0 )
                        .attr("transform"," translate("+String( (svgTooltipWidth*.7)+anchoVol+2   )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                        .text(function(){
                        
                            return Math.round( arr[i].DifPer*1000)/10+"%";
                        })
                        .transition().delay(0).duration(1000)
                        .style("opacity",1 )
                    ;


            d3.select("#svgTooltip4")
                    .append("text")						
                    .attr("class","abasDetail")
                    .style("fill","#ffffff")		
                    .style("font-family","Cabin")
                    .style("font-weight","bold")
                    .style("font-size",tamanioFuente)						
                    .style("text-anchor","start")
                    .style("opacity",0 )
                    .attr("transform"," translate("+String( svgTooltipWidth*.2 )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                    .text(function(){                 
                    
                    return formatNumber(Math.round(arr[i].VolumenPlan));

                    })
                    .transition().delay(0).duration(i*50)
                    .style("opacity",1 )
                ;

        d3.select("#svgTooltip4")
                .append("text")						
                .attr("class","ventasDetail")
                .style("fill","#ffffff")		
                .style("font-family","Cabin")
                .style("font-weight","bold")
                .style("font-size",tamanioFuente)						
                .style("text-anchor","start")
                .style("opacity",0 )
                .attr("transform"," translate("+String( svgTooltipWidth*.4  )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                .text(function(){
                
                    return formatNumber(Math.round(arr[i].VolumenReal));

                })
                .transition().delay(0).duration(i*50)
                .style("opacity",1 )
                ;
                
        d3.select("#svgTooltip4")
                .append("text")						
                .attr("class","ventasDetail")
                .style("fill","#ffffff")		
                .style("font-family","Cabin")
                .style("font-weight","bold")
                .style("font-size",tamanioFuente)						
                .style("text-anchor","start")
                .style("opacity",0 )
                .attr("transform"," translate("+String( svgTooltipWidth*.55  )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                .text(function(){
                
                    return formatNumber(Math.round(arr[i].Dif));

                })
                .transition().delay(0).duration(i*50)
                .style("opacity",1 )
            ;


        d3.select("#svgTooltip4")
                    .append("text")						
                    .attr("class","abasDetail")
                    .style("fill","#ffffff")		
                    .style("font-family","Cabin")
                    .style("font-weight","bold")
                    .style("font-size",tamanioFuente)	
                    .style("text-anchor","start")
                    .style("pointer-events","auto")
                    .attr("transform"," translate("+String( 5  )+","+String( altura*caso+(tamanioFuente )+marginTop   )+")  rotate("+(0)+") ")
                    .text(function(){
                        this.name=arr[i].key;
                        return  arr[i].key;

                    }) .on("mouseover",function(){
                        d3.select(this).style("fill","#F0FF00");
                    
                        })
                        .on("mouseout",function(){
                                d3.select(this).style("fill","#FFFFFF");
                                
                        })
                        .on("click",function(){
                                
                            kpiExpert_ABAS.eraseChart();

                            if(filterControls){
                                    filterControls.lookForEntity(this.name);
                            }
                                
                        });

                        caso++;

            
        }    

       

    }