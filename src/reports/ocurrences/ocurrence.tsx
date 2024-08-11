import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

export default function ocurrencePDF(ocurrence: any) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  const docDef: any = {
    pageSize: 'A4',
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
        text: `O Profissional ${ocurrence.user.name}, no dia ${new Date(ocurrence.createdAt).toLocaleDateString()}, produziu o registro de ocorrência dos alunos:`,
        style: ["normal", "bold"],
        margin: [0, 40, 0, 0]
      },
      {
        text: ocurrence.students.map((student: any) => student.name).join(", "),
        style: "normal",
        margin: [0, 5, 0, 0]
      },
      {
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5 }],
        margin: [0, 10, 0, 10]
      },
      {
        text: `Onde descreveu:`,
        style: ["normal", "bold"]
      },
      {
        text: ocurrence.description,
        style: "normal",
        margin: [0, 5, 0, 0]
      },
      {
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5 }],
        margin: [0, 10, 0, 10]
      },
      {
        text: `Em sequencia regimentar, o profissional da gestão ${ocurrence.responsible.name}, despacha:`,
        style: ["normal", "bold"]
      },
      {
        text: ocurrence.dispatch,
        style: ["normal"],
        margin: [0, 5, 0, 0]
      },
    ],
    footer: {
      columns: [
        {
          text: 'Assinatura do Responsável',
          style: ['normal', 'bold'],
          alignment: 'left',
          margin: [60, 0, 0, 0]
        },
        {
          text: 'Assinatura do Gestor',
          style: ['normal', 'bold'],
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
        alignment: "justify"
      },
      bold: {
        bold: true,
      }
    }
  };

  pdfMake.createPdf(docDef).open()
}