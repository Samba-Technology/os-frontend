import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

export default function occurrencePDF(occurrence: any) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  const docDef: any = {
    pageSize: 'A4',
    info: {
      title: 'Ocorrencia Disciplinar',
      author: occurrence.responsible.name
    },
    content: [
      {
        text: 'Ocorrência Disciplinar',
        style: 'header',
      },
      {
        text: `O Profissional ${occurrence.user.name}, no dia ${new Date(occurrence.createdAt).toLocaleDateString()}, produziu o registro de ocorrência dos alunos:`,
        style: ["normal", "bold"],
        margin: [0, 40, 0, 0]
      },
      {
        text: occurrence.students.map((student: any) => student.name + " (" + student.class + ")").join(", "),
        style: "normal",
        margin: [0, 5, 0, 0]
      },
      {
        text: "cujo(s) tutor(es) é(são):",
        style: ["normal", "bold"],
        margin: [0, 5, 0, 0]
      },
      {
        text: occurrence.tutors.map((tutor: any) => tutor.name).join(", "),
        style: "normal",
        margin: [0, 5, 0, 0]
      },
      {
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5 }],
        margin: [0, 10, 0, 10]
      },
      {
        text: `E descreveu:`,
        style: ["normal", "bold"]
      },
      {
        text: occurrence.description,
        style: "normal",
        margin: [0, 5, 0, 0]
      },
      {
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5 }],
        margin: [0, 10, 0, 10]
      },
      {
        text: `Em sequencia regimentar, o profissional da gestão ${occurrence.responsible.name}, despacha:`,
        style: ["normal", "bold"]
      },
      {
        text: occurrence.dispatch,
        style: ["normal"],
        margin: [0, 5, 0, 0]
      },
    ],
    footer: {
      columns: [
        {
          text: 'Assinatura do Aluno',
          style: ['normal'],
          alignment: 'left',
          margin: [10, 0, 0, 0]
        },
        {
          text: 'Assinatura do Responsável',
          style: ['normal'],
          margin: [0, 0, 5, 0]
        },
        {
          text: 'Totor(es) (se necessário)',
          style: ['normal'],
          margin: [5, 0, 0, 0]
        },
        {
          text: 'Assinatura do Gestor',
          style: ['normal'],
          alignment: 'right',
          margin: [0, 0, 10, 0]
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