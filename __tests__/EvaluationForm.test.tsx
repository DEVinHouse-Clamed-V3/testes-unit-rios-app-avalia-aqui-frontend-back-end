import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import { Alert } from "react-native";
import axios from "axios";
import FormAva from "../src/pages/FormAva";
import { useRoute } from "@react-navigation/native";

jest.mock("axios");
jest.mock("@react-navigation/native", () => ({
  useRoute: jest.fn(),
}));

describe("FormAva Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRoute as jest.Mock).mockReturnValue({
      params: {
        productId: 1,
        productName: "Test Product",
        productImage: "https://example.com/image.jpg",
      },
    });
  });

  it("renders the form correctly", () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: [] });
    const { getByPlaceholderText, getByText } = render(<FormAva />);

    expect(getByText("Test Product")).toBeTruthy();
    expect(getByPlaceholderText("Nome")).toBeTruthy();
    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Descreva sua experiência")).toBeTruthy();
    expect(getByText("Enviar Feedback")).toBeTruthy();
    expect(getByText("Recomendaria para outras pessoas?")).toBeTruthy();
  });

  it("validates empty fields on submit", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: [] });
    const alertMock = jest.spyOn(Alert, "alert").mockImplementation(() => {});
    const { getByText } = render(<FormAva />);
    const submitButton = getByText("Enviar Feedback");

    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(
        "Erro",
        "Por favor, preencha todos os campos."
      );
    });

    alertMock.mockRestore();
  });


  it("envia o formulário com sucesso", async () => {
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: { message: "Feedback enviado com sucesso" } });
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: [] }); 

    const alertMock = jest.spyOn(Alert, "alert").mockImplementation(() => {});

    const { getByPlaceholderText, getByText } = render(<FormAva />);

    const nameInput = getByPlaceholderText("Nome");
    const emailInput = getByPlaceholderText("Email");
    const experienceInput = getByPlaceholderText("Descreva sua experiência");

    await act(async () => {
      fireEvent.changeText(nameInput, "John Doe");
      fireEvent.changeText(emailInput, "john.doe@example.com");
      fireEvent.changeText(experienceInput, "Minha experiência foi ótima!");
    });

    const submitButton = getByText("Enviar Feedback");
    await act(async () => {
      fireEvent.press(submitButton);
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/reviews"),
        expect.objectContaining({
          productId: 1,
          name: "Test Product", 
          email: "john.doe@example.com",
          experience: "Minha experiência foi ótima!",
          recommend: false,
          feedback: "ruim", 
        })
      );
    });

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Sucesso", "Feedback enviado com sucesso!");
    });

    alertMock.mockRestore();
  });

  it("displays reviews correctly", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [
        {
          product_id: 1,
          name: "John Doe",
          feedback: "ótimo",
          experience: "Great experience",
          recommend: true,
        },
      ],
    });

    const { findByText } = render(<FormAva />);

    expect(await findByText("John Doe")).toBeTruthy();
    expect(await findByText("ótimo - Great experience")).toBeTruthy();
    expect(await findByText("Recomendou: Sim")).toBeTruthy();
  });
});
