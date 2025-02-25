const form = document.getElementById('form_editar');
const nome_P = document.getElementById('nome_P');
const desenho_P = document.getElementById('desenho_P');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        nome_P: nome_P.value,
        desenho_P: desenho_P.value,
        id: id
    };

    try{
        const response = await fetch('/edita-personagem', {
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
        }
    } catch (error){
        console.log('Error: ', error);
    }
});