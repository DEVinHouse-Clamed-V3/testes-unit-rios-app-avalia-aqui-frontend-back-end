import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Home from "../src/pages/Home";

describe("Home Screen", () => {
  const mockNavigate = jest.fn();

  const navigation: any = {
    navigate: mockNavigate,
  };

  it("deve renderizar o título 'Avalie Aqui'", () => {
    const { getByText } = render(<Home navigation={navigation} />);
    expect(getByText("Avalie Aqui")).toBeTruthy();
  });

  it("deve renderizar o texto explicativo", () => {
    const { getByText } = render(<Home navigation={navigation} />);
    expect(
      getByText("Escolha o produto que deseja avaliar e compartilhe sua experiência com outros consumidores.")
    ).toBeTruthy();
  });

  it("deve renderizar o botão 'Entrar'", () => {
    const { getByText } = render(<Home navigation={navigation} />);
    expect(getByText("Entrar")).toBeTruthy();
  });

  it("deve navegar para a tela 'Products' ao pressionar o botão", () => {
    const { getByText } = render(<Home navigation={navigation} />);
    const button = getByText("Entrar");

    fireEvent.press(button);

    expect(mockNavigate).toHaveBeenCalledWith("Products");
  });

  it("deve renderizar todas as 3 imagens", () => {
    const { getByTestId } = render(<Home navigation={navigation} />);
    
    expect(getByTestId("home-img-1")).toBeTruthy();
    expect(getByTestId("home-img-2")).toBeTruthy();
    expect(getByTestId("home-img-3")).toBeTruthy();
  });
});
