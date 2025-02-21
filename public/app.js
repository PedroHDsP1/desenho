const form = document.getElementById('form_inscricao');
const nome_P = document.getElementById('nome');
const desenho_P = document.getElementById('email');
const idade = document.getElementById('senha');


form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        nome: nome_P.value,
        email: desenho_P.value,
        senha: idade.value,
    };

    try{
        const response = await fetch('/registra-nome_P', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        document.getElementById('message').innerHTML = result.message;
        if(result.status != 'failed'){
            nome_P.value = '';
            desenho_P.value= '';
            idade.value = '';
        }
    } catch (error){
        console.log('Error: ', error);
    }
});