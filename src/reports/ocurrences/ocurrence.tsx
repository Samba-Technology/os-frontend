import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

export default function ocurrencePDF(ocurrence: any) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  console.log(ocurrence)

  const docDef: any = {
    info: {
      title: 'Ocorrencia Disciplinar',
      author: ocurrence.responsible.name
    },
    content: [
      {
        text: 'Ocorrência Disciplinar',
        style: 'header',
      },
      {
        text: `O Profissional ${ocurrence.user.name}, no dia ${new Date(ocurrence.createdAt).toLocaleDateString()},`,
        style: "normal",
        margin: [0, 30, 0, 0]
      },
      {
        text: `Produziu o registro de ocorrência dos alunos ${ocurrence.students.map((student: any) => student.name).join(", ")}`,
        style: "normal",
        margin: [0, 20, 0, 0]
      },
      {
        text: `Onde descreveu: ${ocurrence.description}`,
        style: "normal",
        margin: [0, 20, 0, 0]
      },
      {
        text: `Em sequencia regimentar, o profissional da gestão ${ocurrence.responsible.name}, despacha: ${ocurrence.dispatch}`,
        style: "normal",
        margin: [0, 20, 0, 0]
      }
    ],
    footer: {
      columns: [
        {
          text: 'Assinatura do Responsável',
          style: ['normal', 'footer'],
          alignment: 'left',
          margin: [60, 0, 0, 0]
        },
        {
          text: 'Assinatura do Gestor',
          style: ['normal', 'footer'],
          alignment: 'right',
          margin: [0, 0, 60, 0]
        }
      ]
    },
    styles: {
      header: {
        fontSize: 22,
        bold: true,
        alignment: "center"
      },
      normal: {
        italics: true,
      },
      footer: {
        bold: true,
      }
    }
  };

  pdfMake.createPdf(docDef).open()
}