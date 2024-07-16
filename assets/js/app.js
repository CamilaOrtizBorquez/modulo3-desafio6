function traerInputs (){
    const input = document.querySelector('#inputValor');
    const select = document.querySelector('#selectMoneda');
    let valorInput =Number(input.value);
    let valorSelect = select.value;
    return [valorInput, valorSelect];
}


async function convertirCLP (selectMoneda, inputValor){
    try{
        
        const res = await fetch(`https://mindicador.cl/api/`);
        const data = await res.json();
        let valorAPI=0;

        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                if(selectMoneda==key)
                {
                    valorAPI=data[key].valor;
                    break;
                }
            }
        }

        const conversion = parseFloat(inputValor) / valorAPI;
        return conversion

    }catch (e){
        console.log ('Hay un error:', e.message);
    }
}

function mostrarConversion (valor){
    document.querySelector('#resultado').innerHTML = valor;
}

async function getGrafico(valorSelect){
    const res = await fetch(`https://mindicador.cl/api/${valorSelect}`);
    const data = await res.json();

    const fechas=data.serie.map((item)=>(
        item.fecha.split("T")[0]
    ));

    const valores=data.serie.map((item)=>(
        item.valor
    ));

        
    const config = {
        type: "line",
        data: {
            labels: fechas,
            datasets: [{
                label: `Moneda ${valorSelect}`,
                backgroundColor: "white",
                data: valores
            }]
        }
    };

    return config;
}

async function pressButton(){
    const [valorInput, valorSelect] = traerInputs();
    const valorConvertido = await convertirCLP (valorSelect,valorInput);
    mostrarConversion(valorConvertido);
    const configChart=await getGrafico(valorSelect);

    validarChart();

    const chartDOM = document.getElementById("myChart");

    new Chart(chartDOM, configChart);

}

function validarChart(){
    //valida el chart para destruir en caso que exista previamente
    const existeChart = Chart.getChart("myChart");
    if (existeChart != undefined) {
        existeChart.destroy();
    }
    //valida el chart para destruir en caso que exista previamente
}

const button = document.querySelector('.btn');
button.addEventListener('click', pressButton);
