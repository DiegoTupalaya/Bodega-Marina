function Visualizar(){

    
    if(document.getElementById('NuevoCliente').hasAttribute('hidden')==false){

        
        document.getElementById('NuevoCliente').setAttribute('hidden','');
        
    }
    else{

        
        document.getElementById('NuevoCliente').removeAttribute('hidden');

    }
    
}