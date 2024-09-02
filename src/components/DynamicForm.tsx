import { useForm, Controller } from "react-hook-form";
import Select, { SingleValue } from "react-select";
import countryList from "react-select-country-list";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  Flex,
  Image,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Select as ChakraSelect,
} from "@chakra-ui/react";
import { FormData, InputField } from "../interfaces";

interface IProps {
  formData: FormData;
}

type FormValues = {
  [key: string]: string | boolean | number;
};

type CountryOption = {
  label: string;
  value: string;
};

const DynamicForm = ({ formData }: IProps) => {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      phone: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form Submitted:", data);
  };

  const handleSelectChange = (
    name: string,
    value: SingleValue<CountryOption>
  ) => {
    console.log(`Selected ${name}:`, value);
  };

  const renderInput = (input: InputField) => {
    switch (input.type) {
      case "text":
      case "email":
        return (
          <FormControl key={input._id} isRequired={input.required}>
            <FormLabel>{input.label}</FormLabel>
            <Input
              type={input.type}
              placeholder={input.placeholder}
              {...register(input.name, { required: input.required })}
            />
            {errors[input.name] && (
              <span style={{ color: "red" }}>{input.label} is required.</span>
            )}
          </FormControl>
        );
      case "phone":
        return (
          <FormControl key={input._id} isRequired={input.required}>
            <FormLabel>{input.label}</FormLabel>
            <Controller
              name={input.name}
              control={control}
              rules={{ required: `${input.label} is required` }}
              render={({ field }) => (
                <>
                  <PhoneInput
                    {...field}
                    country={"eg"}
                    enableSearch={true}
                    inputStyle={{ width: "100%" }}
                    containerStyle={{ marginBottom: "10px" }}
                    onChange={(phone) => field.onChange(phone)}
                    value={typeof field.value === "string" ? field.value : ""}
                  />
                  {errors[input.name] && (
                    <span style={{ color: "red" }}>
                      {errors[input.name]?.message?.toString()}
                    </span>
                  )}
                </>
              )}
            />
          </FormControl>
        );
      case "select":
        return (
          <FormControl key={input._id} isRequired={input.required}>
            <FormLabel>{input.label}</FormLabel>
            <ChakraSelect
              {...register(input.name, { required: input.required })}
            >
              <option value="">Select an option</option>
              {input.options.map((option: string, index: number) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </ChakraSelect>
            {errors[input.name] && (
              <span style={{ color: "red" }}>{input.label} is required.</span>
            )}
          </FormControl>
        );
      case "checkbox":
        return (
          <FormControl
            key={input._id}
            isRequired={input.required}
            display={"flex"}
          >
            <FormLabel>{input.label}</FormLabel>
            <input
              type="checkbox"
              {...register(input.name, { required: input.required })}
            />
            {errors[input.name] && (
              <span style={{ color: "red" }}>{input.label} is required.</span>
            )}
          </FormControl>
        );
      case "radio":
        return (
          <FormControl
            key={input._id}
            isRequired={input.required}
            display={"flex"}
            style={{ flexWrap: "wrap" }}
          >
            <FormLabel>{input.label}</FormLabel>
            {input.options.map((option: string, index: number) => (
              <div
                key={index}
                style={{ marginLeft: "4px", marginRight: "4px" }}
              >
                <input
                  type="radio"
                  value={option}
                  {...register(input.name, { required: input.required })}
                />
                {option}
              </div>
            ))}
            {errors[input.name] && (
              <span style={{ color: "red" }}>{input.label} is required.</span>
            )}
          </FormControl>
        );
      case "country":
        return (
          <FormControl key={input._id} isRequired={input.required}>
            <FormLabel>{input.label}</FormLabel>
            <Controller
              name={input.name}
              control={control}
              render={({ field }) => (
                <>
                  <Select
                    key={input._id}
                    options={countryList().getData()}
                    name={input.name}
                    onChange={(newValue) => {
                      field.onChange(newValue);
                      handleSelectChange(input.name, newValue);
                    }}
                    isClearable
                  />
                  {errors[input.name] && (
                    <span style={{ color: "red" }}>
                      {input.label} is required.
                    </span>
                  )}
                </>
              )}
            />
          </FormControl>
        );
      default:
        return null;
    }
  };

  return (
    <Flex
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <Image src={formData.banner} alt="banner" />
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
          {formData.title}
        </Heading>

        {formData.inputs.map((input) => (
          <div key={input._id}>{renderInput(input)}</div>
        ))}
        <Stack spacing={6} direction={["column", "row"]}>
          <Button
            bg={"red.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "red.500",
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            bg={"blue.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "blue.500",
            }}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
};

export default DynamicForm;
