import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Tooltip, DialogContentText, MenuItem, Select, FormControl, InputLabel, Box } from '@mui/material';
import Papa from 'papaparse';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@/helpers/validation';
import { error } from 'console';
import { StudentsService } from '@/services/api/students.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type Data = {
  students: any[],
  series: string,
  class: string,
}

const schema = yup.object({
  students: yup.array().required(),
  series: yup.string().required(),
  class: yup.string().required(),
})

interface CSVData {
  [key: string]: string;
}

export default function StudentsUploadDialog({ isOpen, onClose }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm<Data>({
    resolver: yupResolver(schema),
    defaultValues: {
      students: [],
      series: "",
      class: "",
    }
  })

  const onSubmit = async (data: Data) => {
    try {
      setLoading(true)

      if (data.students.length > 0) {
        const students = await StudentsService.createMany(data.students, data.series, data.class)
        if (students.data.count > 0) {
          toast.success(`${students.data.count} estudantes criados com sucesso!`)
        } else {
          toast.info("Estudantes já cadastrados.")
        }
      } else {
        toast.error("Faça o upload de um arquivo para continuar.")
      }

      onClose()
      reset()
    } catch (error) {
      toast.error("Algo deu errado.")
    } finally {
      setLoading(false);
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile || null);
  };

  const handleFileUpload = () => {
    if (file) {
      Papa.parse<CSVData>(file, {
        header: true,
        skipEmptyLines: true,
        preview: 0,
        beforeFirstChunk: function (chunk) {
          return chunk.split('\n').slice(5).join('\n');
        },
        complete: (result) => {
          let students: any[] = [];

          result.data.forEach((student: any) => {
            const {
              "Data de Nascimento": _,
              "Email Microsoft": __,
              "Email Google": ___,
              "Nº de chamada": ____,
              "Situação do Aluno": _____,
              "Dig. RA": ______,
              "Nome do Aluno": name,
              "RA": ra
            } = student;

            const filteredStudent = {
              name,
              ra: ra.replace(/^0+/, '') + student["Dig. RA"]
            };

            if (student["Situação do Aluno"] === "Ativo") {
              students.push(filteredStudent);
            }
          });

          toast.success("Arquivo carregado com sucesso!")
          setValue("students", students)
        },
        error: (error) => {
          console.error(error);
        },
      });
    };
  };

  useEffect(() => {
    handleFileUpload();
  }, [file])

  return (
    <Dialog open={isOpen} onClose={onClose} component="form" onSubmit={handleSubmit(onSubmit)}>
      <DialogTitle className="flex justify-between items-center">
        <p>Registro de estudantes</p>
        <div className="cursor-pointer" onClick={() => {
          onClose()
          reset()
        }}>
          <Tooltip title="Fechar">
            <CloseIcon />
          </Tooltip>
        </div>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>Faça o Upload do arquivo CSV da classe desejada.</DialogContentText>
        <div className='flex flex-col gap-4 !pt-3'>
          <Box className="flex gap-1">
            <FormControl className="w-1/2">
              <InputLabel>Série</InputLabel>
              <Controller
                name="series"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <Select label="Série" error={!!errors.series} value={value} onChange={onChange} >
                    <MenuItem value="6">6º</MenuItem>
                    <MenuItem value="7">7º</MenuItem>
                    <MenuItem value="8">8º</MenuItem>
                    <MenuItem value="1">1ª</MenuItem>
                    <MenuItem value="2">2ª</MenuItem>
                    <MenuItem value="3">3ª</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
            <FormControl className="w-1/2">
              <InputLabel>Turma</InputLabel>
              <Controller
                name="class"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <Select label="Turma" error={!!errors.class} value={value} onChange={onChange}>
                    <MenuItem value="A">A</MenuItem>
                    <MenuItem value="B">B</MenuItem>
                    <MenuItem value="C">C</MenuItem>
                    <MenuItem value="D">D</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Box>
          <div className='flex justify-center'>
            <input type="file" accept=".csv" onChange={handleFileChange} />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" type="submit" disabled={loading}>Criar</Button>
      </DialogActions>
    </Dialog>
  );
};