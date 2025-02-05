import Classes from "./PokemonCreateForm.module.css";
import { useEffect, useState } from "react";
import {
  getTypes,
  postPokemon,
  getSinglePokemon,
  updatePokemon,
} from "../../actions/actions";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import Cross from "../../img/cross.png";
import { validateForm } from "./validate";

const PokemonCreateForm = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  // States globales
  const pokemonToUpdate = useSelector((state) => state.pokemonCopy);
  const types = useSelector((state) => state.types);

  // Estados locales
  const [errors, setErrors] = useState({});
  const [updated, setUpdated] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({}); // Para saber si un campo fue “tocado”

  const [formState, setFormState] = useState({
    name: "",
    hp: "",
    attack: "",
    defense: "",
    speed: "",
    weight: "",
    height: "",
    img: "",
    types: [],
  });

  // Para obtener types y, si hay id, buscar el Pokémon a actualizar
  useEffect(() => {
    dispatch(getTypes());
    if (id) dispatch(getSinglePokemon(id));
  }, [dispatch, id]);

  // Manejar click en íconos de tipos
  const handleImgClick = (e) => {
    if (!selectedTypes.includes(e.target.name) && selectedTypes.length < 2) {
      const newTypes = [...selectedTypes, e.target.name];
      setSelectedTypes(newTypes);
      setFormState({ ...formState, types: newTypes });
      setErrors(validateForm({ ...formState, types: newTypes }));

      // Marcar 'types' como touched
      setTouched((prev) => ({ ...prev, types: true }));
    }
  };

  // Eliminar el último tipo seleccionado
  const handleDelete = () => {
    const newTypes = [...selectedTypes];
    newTypes.pop();
    setSelectedTypes(newTypes);
    setFormState({ ...formState, types: newTypes });
    setErrors(validateForm({ ...formState, types: newTypes }));

    // Marcar 'types' como touched
    setTouched((prev) => ({ ...prev, types: true }));
  };

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormState = { ...formState, [name]: value };
    
    // Marcar como touched si no lo estaba (para mostrar error al tipear)
    if (!touched[name]) {
      setTouched((prev) => ({ ...prev, [name]: true }));
    }
    
    setFormState(newFormState);
    setErrors(validateForm(newFormState));
  };

  // Manejar blur para marcar touched también al salir del campo (opcional)
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // Manejar submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true); // Marcar que se hizo submit

    // Convertir a number campos numéricos
    const createdOrUpdatedPokemon = {
      ...formState,
      hp: parseInt(formState.hp),
      attack: parseInt(formState.attack),
      defense: parseInt(formState.defense),
      speed: parseInt(formState.speed),
      weight: parseInt(formState.weight),
      height: parseInt(formState.height),
    };

    // Validar
    const currentErrors = validateForm(createdOrUpdatedPokemon);
    setErrors(currentErrors);

    // Chequear si no hay errores
    if (Object.keys(currentErrors).length === 0) {
      if (!id) {
        dispatch(postPokemon(createdOrUpdatedPokemon));
      } else {
        dispatch(updatePokemon(id, createdOrUpdatedPokemon));
      }
      // Reset
      setFormState({
        name: "",
        hp: "",
        attack: "",
        defense: "",
        speed: "",
        weight: "",
        height: "",
        img: "",
        types: [],
      });
      setSelectedTypes([]);
      navigate("/home");
    }
  };

  // En caso de UPDATE: cargar datos en formState solo una vez
  if (id && pokemonToUpdate.name && !updated) {
    setSelectedTypes(pokemonToUpdate.types || []);
    setFormState({
      name: pokemonToUpdate.name,
      hp: pokemonToUpdate.hp,
      attack: pokemonToUpdate.attack,
      defense: pokemonToUpdate.defense,
      speed: pokemonToUpdate.speed,
      weight: pokemonToUpdate.weight,
      height: pokemonToUpdate.height,
      img: pokemonToUpdate.img,
      types: pokemonToUpdate.types || [],
    });
    setUpdated(true);
  }

  // Helper para renderizar errores (campo input):
  // Solo se muestra si (touched[field] || submitted) && errors[field]
  const renderError = (field) => {
    if ((touched[field] || submitted) && errors[field]) {
      return <p className={Classes.errorMessage}>{errors[field]}</p>;
    }
    return null;
  };

  return (
    <div className={Classes.container}>
      <NavLink to="/home">
        <button className={Classes.topButton}>BACK TO HOME</button>
      </NavLink>

      <form onSubmit={handleSubmit} className={Classes.form}>
        {/* PRIMERA FILA: Name - Hp */}
        <div className={Classes.row}>
          {/* NAME */}
          <label className={Classes.labelInput}>
            Name
            <input
              className={(touched.name || submitted) && errors.name ? Classes.error : ""}
              onBlur={handleBlur}
              onChange={handleChange}
              value={formState.name}
              name="name"
              type="text"
              placeholder="Insert name..."
            />
            {renderError("name")}
          </label>

          {/* HP */}
          <label className={Classes.labelInput}>
            Hp
            <input
              className={(touched.hp || submitted) && errors.hp ? Classes.error : ""}
              onBlur={handleBlur}
              onChange={handleChange}
              value={formState.hp}
              name="hp"
              type="number"
              min="1"
              placeholder="Insert HP..."
            />
            {renderError("hp")}
          </label>
        </div>

        {/* SEGUNDA FILA: Attack - Defense */}
        <div className={Classes.row}>
          <label className={Classes.labelInput}>
            Attack
            <input
              className={(touched.attack || submitted) && errors.attack ? Classes.error : ""}
              onBlur={handleBlur}
              onChange={handleChange}
              value={formState.attack}
              name="attack"
              type="number"
              min="1"
              placeholder="Insert Attack..."
            />
            {renderError("attack")}
          </label>

          <label className={Classes.labelInput}>
            Defense
            <input
              className={(touched.defense || submitted) && errors.defense ? Classes.error : ""}
              onBlur={handleBlur}
              onChange={handleChange}
              value={formState.defense}
              name="defense"
              type="number"
              min="1"
              placeholder="Insert Defense..."
            />
            {renderError("defense")}
          </label>
        </div>

        {/* TERCERA FILA: Speed - Weight */}
        <div className={Classes.row}>
          <label className={Classes.labelInput}>
            Speed
            <input
              className={(touched.speed || submitted) && errors.speed ? Classes.error : ""}
              onBlur={handleBlur}
              onChange={handleChange}
              value={formState.speed}
              name="speed"
              type="number"
              min="1"
              placeholder="Insert Speed..."
            />
            {renderError("speed")}
          </label>

          <label className={Classes.labelInput}>
            Weight
            <input
              className={(touched.weight || submitted) && errors.weight ? Classes.error : ""}
              onBlur={handleBlur}
              onChange={handleChange}
              value={formState.weight}
              name="weight"
              type="number"
              min="1"
              placeholder="Insert Weight (kg)"
            />
            {renderError("weight")}
          </label>
        </div>

        {/* CUARTA FILA: Height - Image */}
        <div className={Classes.row}>
          <label className={Classes.labelInput}>
            Height
            <input
              className={(touched.height || submitted) && errors.height ? Classes.error : ""}
              onBlur={handleBlur}
              onChange={handleChange}
              value={formState.height}
              name="height"
              type="number"
              min="1"
              placeholder="Insert Height (cm)"
            />
            {renderError("height")}
          </label>

          <label className={Classes.labelInput}>
            Image
            <input
              className={(touched.img || submitted) && errors.img ? Classes.error : ""}
              onBlur={handleBlur}
              onChange={handleChange}
              value={formState.img}
              name="img"
              type="url"
              placeholder="Insert photo url..."
            />
            {renderError("img")}
          </label>
        </div>

        {/* TIPOS */}
        <label className={Classes.labelTypes}>
          Types
          <div
            name="types"
            className={
              (touched.types || submitted) && errors.types
                ? Classes.typesWithError
                : Classes.types
            }
          >
            {selectedTypes.map((type) => (
              <p key={type}>{type}</p>
            ))}
            {selectedTypes.length > 0 && (
              <img
                alt="deleteIcon"
                onClick={handleDelete}
                className={Classes.cross}
                width="40px"
                src={Cross}
              />
            )}
          </div>
          {/* Mostrar error de types solo si “touched.types” o “submitted” */}
          {(touched.types || submitted) && errors.types && (
            <p className={Classes.errorMessage}>{errors.types}</p>
          )}
        </label>

        {/* Íconos de tipos */}
        <div className={Classes.icons}>
          {types &&
            types.map((type) => {
              return (
                <div key={type.name}>
                  <img
                    alt="TypeIcon"
                    onClick={handleImgClick}
                    name={type.name}
                    src={require(`../UI/pokeIcons/${type.name}.png`).default}
                  />
                </div>
              );
            })}
        </div>

        {/* BOTÓN SUBMIT */}
        <button type="submit">
          {id ? "Update Pokémon" : "Create Pokémon"}
        </button>
      </form>
    </div>
  );
};

export default PokemonCreateForm;
