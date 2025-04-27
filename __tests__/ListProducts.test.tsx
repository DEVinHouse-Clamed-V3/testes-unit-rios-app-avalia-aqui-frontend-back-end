import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Products from "../src/pages/Products";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Tela de Listagem de Produtos", () => {
  const mockNavigate = jest.fn();

  const mockNavigation = {
    navigate: mockNavigate,
  };

  const mockProducts = [
    {
      id: 1,
      name: "Produto A",
      price: "R$ 100,00",
      brand: "Marca A",
      description: "Descrição A",
      url_image: "https://example.com/imgA.jpg",
      category: "Categoria A",
    },
    {
      id: 2,
      name: "Produto B",
      price: "R$ 200,00",
      brand: "Marca B",
      description: "Descrição B",
      url_image: "https://example.com/imgB.jpg",
      category: "Categoria B",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve exibir o título da tela", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockProducts });
    const { getByText } = render(<Products navigation={mockNavigation} />);

    await waitFor(() => {
      expect(getByText("Produtos")).toBeTruthy();
    });
  });

  it("deve renderizar a lista de produtos corretamente", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockProducts });
    const { getByText } = render(<Products navigation={mockNavigation} />);

    await waitFor(() => {
      expect(getByText("Produto A")).toBeTruthy();
      expect(getByText("Produto B")).toBeTruthy();
    });
  });

  it("deve navegar para a tela de avaliação ao clicar em 'Avaliar'", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockProducts });
    const { getAllByText } = render(<Products navigation={mockNavigation} />);

    await waitFor(() => {
      const buttons = getAllByText("Avaliar");
      fireEvent.press(buttons[0]);
      expect(mockNavigate).toHaveBeenCalledWith("FormAva", {
        productId: 1,
        productName: "Produto A",
        productImage: "https://example.com/imgA.jpg",
      });
    });
  });

  it("deve exibir o indicador de carregamento enquanto os dados estão sendo buscados", () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {}));
    const { getByTestId } = render(<Products navigation={mockNavigation} />);
    expect(getByTestId("ActivityIndicator")).toBeTruthy();
  });
});
