import * as yup from 'yup'

yup.setLocale({
    mixed: {
        required: 'Preencha esse campo para continuar.'
    },
    string: {
        email: 'Esse email não é válido.',
        min: 'Valor muito curto.',
        max: 'Valor muito alto.'
    },
    array: {
        min: 'É necessário selecionar pelo menos 1 item para continuar.'
    }
})

export default yup;