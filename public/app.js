const form = document.getElementById('form_inscricao');
const nome_P = document.getElementById('nome_P');
const desenho_P = document.getElementById('desenho_P');
const idade = document.getElementById('idade');


form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        nome: nome_P.value,
        desenho_P: desenho_P.value,
        idade: idade.value,
    };

    try{
        const response = await fetch('/registra-personagem', {
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