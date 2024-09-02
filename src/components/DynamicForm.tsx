import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Select, { SingleValue } from "react-select";
import { z } from "zod";
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
import { createZodSchema } from "../utils/createZodSchema";
import { useMemo } from "react";

interface IProps {
  formData: FormData;
}
type FormValues = z.infer<typeof schema>;

type CountryOption = {
  label: string;
  value: string;
};

const DynamicForm = ({ formData }: IProps) => {
  const schema = useMemo(
    () => createZodSchema(formData.inputs),
    [formData.inputs]
  );

  const {
    handleSubmit,
    control,
    register,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: formData.inputs.reduce((acc, input) => {
      acc[input.name] = input.type === "checkbox" ? false : "";
      return acc;
    }, {} as FormValues),
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
          <FormControl
            key={input._id}
            isRequired={input.required}
            isInvalid={!!errors[input.name]}
          >
            <FormLabel>{input.label}</FormLabel>
            <Input
              type={input.type}
              placeholder={input.placeholder}
              {...register(input.name)}
            />
            {errors[input.name] && (
              <span style={{ color: "red" }}>
                {errors[input.name]?.message}
              </span>
            )}
          </FormControl>
        );

      case "phone":
        return (
          <FormControl
            key={input._id}
            isRequired={input.required}
            isInvalid={!!errors[input.name]}
          >
            <FormLabel>{input.label}</FormLabel>
            <Controller
              name={input.name}
              control={control}
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
          <FormControl
            key={input._id}
            isRequired={input.required}
            isInvalid={!!errors[input.name]}
          >
            <FormLabel>{input.label}</FormLabel>
            <ChakraSelect {...register(input.name)}>
              <option value="">Select an option</option>
              {input.options?.map((option: string, index: number) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </ChakraSelect>
            {errors[input.name] && (
              <span style={{ color: "red" }}>
                {errors[input.name]?.message}
              </span>
            )}
          </FormControl>
        );

      case "checkbox":
        return (
          <FormControl
            key={input._id}
            isRequired={input.required}
            display={"flex"}
            alignItems="center"
            isInvalid={!!errors[input.name]}
          >
            <Controller
              name={input.name}
              control={control}
              render={({ field }) => (
                <input type="checkbox" {...field} checked={field.value} />
              )}
            />
            <FormLabel htmlFor={input.name} mb="0" ml="2">
              {input.label}
            </FormLabel>
            {errors[input.name] && (
              <span style={{ color: "red" }}>
                {errors[input.name]?.message}
              </span>
            )}
          </FormControl>
        );

      case "radio":
        return (
          <FormControl
            key={input._id}
            isRequired={input.required}
            isInvalid={!!errors[input.name]}
          >
            <FormLabel>{input.label}</FormLabel>
            {input.options?.map((option: string, index: number) => (
              <label key={index} style={{ marginRight: "10px" }}>
                <input type="radio" value={option} {...register(input.name)} />
                {option}
              </label>
            ))}
            {errors[input.name] && (
              <span style={{ color: "red" }}>
                {errors[input.name]?.message}
              </span>
            )}
          </FormControl>
        );

      case "country":
        return (
          <FormControl
            key={input._id}
            isRequired={input.required}
            isInvalid={!!errors[input.name]}
          >
            <FormLabel>{input.label}</FormLabel>
            <Controller
              name={input.name}
              control={control}
              render={({ field }) => {
                const selectedCountry = countryList()
                  .getData()
                  .find((country) => country.value === field.value);

                return (
                  <>
                    <Select
                      key={input._id}
                      options={countryList().getData()}
                      name={input.name}
                      value={selectedCountry || null}
                      onChange={(newValue) => {
                        field.onChange(newValue?.value || "");
                        handleSelectChange(input.name, newValue);
                      }}
                      isClearable
                    />
                    {errors[input.name] && (
                      <span style={{ color: "red" }}>
                        {errors[input.name]?.message?.toString()}
                      </span>
                    )}
                  </>
                );
              }}
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
            disabled={!isValid} // Disable the button if the form is not valid
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
};

export default DynamicForm;
