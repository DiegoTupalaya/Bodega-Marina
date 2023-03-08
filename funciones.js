
function Visualizar(){

    
    if(document.getElementById('NuevoCliente').hasAttribute('hidden')==false){

        
        document.getElementById('NuevoCliente').setAttribute('hidden','');
        
    }
    else{

        
        document.getElementById('NuevoCliente').removeAttribute('hidden');

    }
    
}

function Activar(i) {

    if(document.getElementById('txtAgregar'+i).disabled==false){

        
        document.getElementById('txtAgregar'+i).disabled = true;
        document.getElementsByName('btnAgregar')[i-1].setAttribute('hidden','');
        document.getElementsByName('btnDescontar')[i-1].setAttribute('hidden','');

    }
    else{

        
        document.getElementById('txtAgregar'+i).disabled = false;
        document.getElementById('txtAgregar'+i).focus();
        document.getElementsByName('btnAgregar')[i-1].removeAttribute('hidden');
        document.getElementsByName('btnDescontar')[i-1].removeAttribute('hidden');

    }   
}