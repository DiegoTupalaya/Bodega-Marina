
function Visualizar(){

    
    if(document.getElementById('NuevoCliente').hasAttribute('hidden')==false){

        
        document.getElementById('NuevoCliente').setAttribute('hidden','');
        
    }
    else{

        
        document.getElementById('NuevoCliente').removeAttribute('hidden');

    }
    
}

function Activar() {

    if(document.getElementById('txtAgregar').disabled==false){

        
        document.getElementById('txtAgregar').disabled = true;

    }
    else{

        
        document.getElementById('txtAgregar').disabled = false;


    }   
}