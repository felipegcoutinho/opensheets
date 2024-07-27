import UseOptions from "@/hooks/UseOptions";
import { useState } from "react";
import { addCards, updateCards } from "../actions/cards";

function Utils() {
  const [isOpen, setIsOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [statusPagamento, setStatusPagamento] = useState(false);

  const [openImg, setOpenImg] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageSelect = (imgSrc) => {
    setSelectedImage(imgSrc);
    setOpenImg(false);
  };

  const handleSubmit = async (e, selectedColor) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    formData.append("cor_padrao", selectedColor);
    try {
      await addCards(formData);
      alert("Cartão adicionado com sucesso!");
      setIsOpen(false);
    } catch (error) {
      alert("Erro ao adicionar Cartão.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    try {
      await updateCards(formData);
      alert("Cartão adicionado com sucesso!");
      setIsOpen(false);
    } catch (error) {
      alert("Erro ao adicionar Cartão.");
    } finally {
      setLoading(false);
    }
  };

  const getMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    const { optionsMeses } = UseOptions();

    for (let i = -1; i <= 1; i++) {
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const month = optionsMeses[newDate.getMonth()];
      const year = newDate.getFullYear();
      const value = `${month}-${year}`;
      options.push({ value, label: `${month.charAt(0).toUpperCase() + month.slice(1)} de ${year}` });
    }

    return options;
  };

  const [selectedColor, setSelectedColor] = useState("");

  const ColorCircle = ({ color, selected, onClick }) => (
    <div
      className={`w-10 h-8 rounded-full cursor-pointer ${
        selected && "outline outline-2 outline-black saturate-200"
      } bg-${color}-500 hover:saturate-200 hover:shadow-lg`}
      onClick={onClick}
    />
  );

  const colors = [
    "zinc",
    "red",
    "orange",
    "amber",
    "yellow",
    "lime",
    "green",
    "emerald",
    "teal",
    "cyan",
    "sky",
    "blue",
    "indigo",
    "violet",
    "purple",
    "fuchsia",
    "pink",
    "rose",
  ];

  return {
    isOpen,
    setIsOpen,
    loading,
    handleSubmit,
    handleUpdate,
    getMonthOptions,
    statusPagamento,
    setStatusPagamento,
    openImg,
    setOpenImg,
    selectedImage,
    setSelectedImage,
    handleImageSelect,
    selectedColor,
    setSelectedColor,
    ColorCircle,
    colors,
  };
}

export default Utils;
