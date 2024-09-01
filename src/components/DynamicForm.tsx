import { useState, ChangeEvent, FormEvent } from 'react';
import Select, { SingleValue } from 'react-select';
import { FormData, InputField } from '../interfaces';
import countryList from 'react-select-country-list';

//
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import {  Flex, Image,  } from '@chakra-ui/react';
//

//chakra UI components
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,Select as ChakraSelect 
 
} from '@chakra-ui/react'

//

interface IProps {
    formData: FormData;
}

type OptionType = {
  label: string;
  value: string;
};


type FormState = {
  [key: string]: string | boolean | number;
};

const DynamicForm = ({ formData }: IProps) => {
  const [formState, setFormState] = useState<FormState>({});
  const [phone, setPhone] = useState('');


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSelectChange = (name: string, newValue: SingleValue<OptionType>) => {
    setFormState((prevState) => ({ ...prevState, [name]: newValue ? newValue.label : '' }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Form Submitted:', formState);
  };

  const renderInput = (input: InputField) => {
    switch (input.type) {
      case 'text':
      case 'email':
        return (
          <FormControl key={input._id}  isRequired>
            <FormLabel>{input.label}</FormLabel>
            <Input
                type={input.type}
                name={input.name}
                placeholder={input.placeholder}
                required={input.required}
                onChange={handleChange}
              />
          </FormControl>

          
        );
        case 'phone':
          return (

            <FormControl key={input._id}  isRequired>
            <FormLabel>{input.label}</FormLabel>
            <PhoneInput
              country={'eg'}
              value={phone}
              onChange={phone => setPhone(phone)}
              enableSearch={true}
              inputStyle={{ width: '100%' }}
              containerStyle={{ marginBottom: '10px' }}
            />
          </FormControl>
            
           
          );

      case 'select':
        return (
          <FormControl key={input._id}  isRequired>
          <FormLabel>{input.label}</FormLabel>
          <ChakraSelect
            name={input.name}
            required={input.required}
            onChange={handleChange}
          >
            <option value="">Select an option</option>
            {input.options.map((option: string, index: number) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </ChakraSelect>
        </FormControl>

          
        );
      case 'checkbox':
        return (
          <FormControl key={input._id}  isRequired display={"flex"}>
          <FormLabel>{input.label}</FormLabel>
          <input
            type="checkbox"
            name={input.name}
            required={input.required}
            onChange={(e) =>
              setFormState((prevState) => ({
                ...prevState,
                [input.name]: e.target.checked,
              }))
            }/>
              </FormControl>

              /*<FormControl key={input._id}  isRequired>
              <FormLabel>{input.label}</FormLabel>
              <Checkbox display={"inline"} defaultChecked></Checkbox>
            </FormControl>*/
             


          
        );
      case 'radio':
        return (
          
           /*<div key={index}>
              <Input
                type="radio"
                name={input.name}
                value={option}
                required={input.required}
                onChange={handleChange}
              />
              {option}
            </div>*/
            <FormControl key={input._id}  isRequired display={"flex"}>
            <FormLabel>{input.label}</FormLabel>
                {input.options.map((option: string, index: number) => (
                  <div key={index} style={{marginLeft: "4px", marginRight: "4px"}}>
                    <input
                      type="radio"
                      name={input.name}
                      value={option}
                      required={input.required}
                      onChange={handleChange}
                    />
                    {option}
                  </div>
                ))
                }
          </FormControl>
            
          
        );
      case 'country':
        return (
          <Select
            key={input._id}
            options={countryList().getData()}
            name={input.name}
            onChange={(newValue) => handleSelectChange(input.name, newValue)}
            isClearable
          />
        );
      default:
        return null;
    }
  };

  return (
    <Flex as="form"
    onSubmit={handleSubmit}
    minH={'100vh'}
    align={'center'}
    justify={'center'}
    bg={useColorModeValue('gray.50', 'gray.800')}>
    <Stack
      spacing={4}
      w={'full'}
      maxW={'md'}
      bg={useColorModeValue('white', 'gray.700')}
      rounded={'xl'}
      boxShadow={'lg'}
      p={6}
      my={12}>
      <Image src={formData.banner} alt='banner' />
      <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
        {formData.title}
      </Heading>
      
      {formData.inputs.map((input)=>(
        <div key={input._id}>{renderInput(input)}</div>

      ))}
      <Stack spacing={6} direction={['column', 'row']}>
        <Button
          bg={'red.400'}
          color={'white'}
          w="full"
          _hover={{
            bg: 'red.500',
          }}>
          Cancel
        </Button>
        <Button
        type='submit'
          bg={'blue.400'}
          color={'white'}
          w="full"
          _hover={{
            bg: 'blue.500',
          }}>
          Submit
        </Button>
      </Stack>
    </Stack>
  </Flex>
  );
};

/*
<form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', background: formData.color_scheme.primary }}>
      <img src={formData.banner} alt="Banner" style={{ width: '100%' }} />
      <h1 style={{ fontFamily: formData.font, color: formData.color_scheme.secondary }}>{formData.title}</h1>
      {formData.inputs.map((input) => (
        <div key={input._id} style={{ margin: '10px 0' }}>
          <label style={{ fontFamily: formData.font }}>{input.label}</label>
          {renderInput(input)}
        </div>
      ))}
      <button type="submit" style={{ backgroundColor: formData.color_scheme.tertiary }}>
        Register
      </button>
    </form>



    <Input
          placeholder="UserName"
          _placeholder={{ color: 'gray.500' }}
          type="text"
        />
*/

export default DynamicForm;
