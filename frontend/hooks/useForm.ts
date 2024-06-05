import { useEffect, useState } from "react";

export default function useForm<Type extends object>(initial: Type) {
    // create a state object for our inputs
    const [inputs, setInputs] = useState<Type>(initial);
    const initialValues = Object.values(initial).join("");

    useEffect(() => {
        // This function runs when the things we are watching change
        setInputs(initial);
    }, [initialValues]);

    function handleChange(e) {
        const { name, type } = e.target;
        let { value } = e.target;

        if (type === "number") {
            value = parseInt(value);
        }

        if (type === "checkbox") {
            value = e.target.checked;
        }
        setInputs({
            // copy the existing state
            ...inputs,
            [name]: value,
        });
    }

    function resetForm() {
        setInputs(initial);
    }

    // return the things we want to surface from this custom hook
    return {
        inputs,
        handleChange,
        resetForm,
    };
}
