import { View, Text, Image } from "react-native";
import EmpresaInfoScreenStyle from "@/app/Pages/PrincipalApp/EmpresaInfoScreen/EmpresaInfoScreenStyle";
import { calcularMediaEAvaliacoes } from "../utils/avaliacaoUtils";
import UserImg from "../../assets/images/user.jpeg"

const formatarNumero = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(num >= 10000 ? 0 : 1).replace('.', ',') + 'k';
  }
  return num.toString();
};

const RatingBar: React.FC<{ rating: number; count: number; total: number }> = ({ rating, count, total }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <View style={EmpresaInfoScreenStyle.row}>
      <Text style={EmpresaInfoScreenStyle.ratingLabel}>{rating}</Text>
      <View style={EmpresaInfoScreenStyle.barContainer}>
        <View style={EmpresaInfoScreenStyle.barBackground}>
          <View style={[EmpresaInfoScreenStyle.barFill, { width: `${percentage}%` }]} />
        </View>
      </View>
      <Text style={EmpresaInfoScreenStyle.ratingCount}>{formatarNumero(count)}</Text>
    </View>
  );
};

const EmpresaAvaliacao = ({ ratingsData, average, total }: any) => {
  return (
    <View style={[EmpresaInfoScreenStyle.styleContainerServico, { paddingLeft: 0, paddingTop: 0, paddingBottom: 400 }]}>
      <View>
        <View>
          <View style={EmpresaInfoScreenStyle.numeroTotalAvalaiações}>
            <Text style={{ fontSize: 30, color: "white", fontWeight: "bold" }}>{average}</Text>
            <Text style={{ fontSize: 20, color: "white", marginHorizontal: 4 }}>/</Text>
            <Text style={{ fontSize: 20, color: "white" }}>5</Text>
          </View>
          <Text style={EmpresaInfoScreenStyle.totalAvaliacoes}>{formatarNumero(total)} Avaliações</Text>
        </View>
        <View>
          {[5, 4, 3, 2, 1].map((rating) => (
            <RatingBar
              key={rating}
              rating={rating}
              count={ratingsData[rating]}
              total={total}
            />
          ))}
        </View>
        <View style={EmpresaInfoScreenStyle.containerTudoAvalaicao}>
            <Text style={EmpresaInfoScreenStyle.tituloDetalhe}>Avaliações</Text>
            <View>
                <View style={EmpresaInfoScreenStyle.containerAvalaicaoUser}>
                    <View style={EmpresaInfoScreenStyle.containerUserImageName}>
                        <View>
                            <Image source={UserImg} style={EmpresaInfoScreenStyle.userImg}/>
                        </View>
                        <View>
                            <Text style={[EmpresaInfoScreenStyle.textInformationUser, {color: 'white'}]}>
                                Manuel
                            </Text>
                            <Text style={[EmpresaInfoScreenStyle.textInformationUser, {color: 'rgba(255, 255, 255, 0.5)'}]}>
                                2 Feb 2025
                            </Text>
                        </View>
                    </View>
                    <View>
                        <Text style={EmpresaInfoScreenStyle.textDaAvalaicao}>
                            Troca de Oleo executada com sucesso e extrema qualidade e com otima grantia
                        </Text>
                        <View style={{marginTop: 10}}>
                            <View style={EmpresaInfoScreenStyle.containerMembroServico}>
                                <Text style={{fontSize: 12, color: 'rgba(255, 255, 255, 0.34)'}}>Membroda Equipe: </Text>
                                <Text style={{fontSize: 12, color: 'white'}}>Zeca</Text>
                            </View>
                            <View style={EmpresaInfoScreenStyle.containerMembroServico}>
                                <Text style={{fontSize: 12, color: 'rgba(255, 255, 255, 0.34)'}}>Serviço: </Text>
                                <Text style={{fontSize: 12, color: 'white'}}>Toca de Pneus</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={[EmpresaInfoScreenStyle.line, {marginTop: 20}]}/>
                <View style={EmpresaInfoScreenStyle.containerAvalaicaoUser}>
                    <View style={EmpresaInfoScreenStyle.containerUserImageName}>
                        <View>
                            <Image source={UserImg} style={EmpresaInfoScreenStyle.userImg}/>
                        </View>
                        <View>
                            <Text style={[EmpresaInfoScreenStyle.textInformationUser, {color: 'white'}]}>
                                Manuel
                            </Text>
                            <Text style={[EmpresaInfoScreenStyle.textInformationUser, {color: 'rgba(255, 255, 255, 0.5)'}]}>
                                2 Feb 2025
                            </Text>
                        </View>
                    </View>
                    <View>
                        <Text style={EmpresaInfoScreenStyle.textDaAvalaicao}>
                            Troca de Oleo executada com sucesso e extrema qualidade e com otima grantia
                        </Text>
                        <View style={{marginTop: 10}}>
                            <View style={EmpresaInfoScreenStyle.containerMembroServico}>
                                <Text style={{fontSize: 12, color: 'rgba(255, 255, 255, 0.34)'}}>Membroda Equipe: </Text>
                                <Text style={{fontSize: 12, color: 'white'}}>Zeca</Text>
                            </View>
                            <View style={EmpresaInfoScreenStyle.containerMembroServico}>
                                <Text style={{fontSize: 12, color: 'rgba(255, 255, 255, 0.34)'}}>Serviço: </Text>
                                <Text style={{fontSize: 12, color: 'white'}}>Toca de Pneus</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={[EmpresaInfoScreenStyle.line, {marginTop: 20}]}/>
                <View style={EmpresaInfoScreenStyle.containerAvalaicaoUser}>
                    <View style={EmpresaInfoScreenStyle.containerUserImageName}>
                        <View>
                            <Image source={UserImg} style={EmpresaInfoScreenStyle.userImg}/>
                        </View>
                        <View>
                            <Text style={[EmpresaInfoScreenStyle.textInformationUser, {color: 'white'}]}>
                                Manuel
                            </Text>
                            <Text style={[EmpresaInfoScreenStyle.textInformationUser, {color: 'rgba(255, 255, 255, 0.5)'}]}>
                                2 Feb 2025
                            </Text>
                        </View>
                    </View>
                    <View>
                        <Text style={EmpresaInfoScreenStyle.textDaAvalaicao}>
                            Troca de Oleo executada com sucesso e extrema qualidade e com otima grantia
                        </Text>
                        <View style={{marginTop: 10}}>
                            <View style={EmpresaInfoScreenStyle.containerMembroServico}>
                                <Text style={{fontSize: 12, color: 'rgba(255, 255, 255, 0.34)'}}>Membroda Equipe: </Text>
                                <Text style={{fontSize: 12, color: 'white'}}>Zeca</Text>
                            </View>
                            <View style={EmpresaInfoScreenStyle.containerMembroServico}>
                                <Text style={{fontSize: 12, color: 'rgba(255, 255, 255, 0.34)'}}>Serviço: </Text>
                                <Text style={{fontSize: 12, color: 'white'}}>Toca de Pneus</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={[EmpresaInfoScreenStyle.line, {marginTop: 20}]}/>
                <View style={EmpresaInfoScreenStyle.containerAvalaicaoUser}>
                    <View style={EmpresaInfoScreenStyle.containerUserImageName}>
                        <View>
                            <Image source={UserImg} style={EmpresaInfoScreenStyle.userImg}/>
                        </View>
                        <View>
                            <Text style={[EmpresaInfoScreenStyle.textInformationUser, {color: 'white'}]}>
                                Manuel
                            </Text>
                            <Text style={[EmpresaInfoScreenStyle.textInformationUser, {color: 'rgba(255, 255, 255, 0.5)'}]}>
                                2 Feb 2025
                            </Text>
                        </View>
                    </View>
                    <View>
                        <Text style={EmpresaInfoScreenStyle.textDaAvalaicao}>
                            Troca de Oleo executada com sucesso e extrema qualidade e com otima grantia
                        </Text>
                        <View style={{marginTop: 10}}>
                            <View style={EmpresaInfoScreenStyle.containerMembroServico}>
                                <Text style={{fontSize: 12, color: 'rgba(255, 255, 255, 0.34)'}}>Membroda Equipe: </Text>
                                <Text style={{fontSize: 12, color: 'white'}}>Zeca</Text>
                            </View>
                            <View style={EmpresaInfoScreenStyle.containerMembroServico}>
                                <Text style={{fontSize: 12, color: 'rgba(255, 255, 255, 0.34)'}}>Serviço: </Text>
                                <Text style={{fontSize: 12, color: 'white'}}>Toca de Pneus</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
      </View>
    </View>
  );
};

export default EmpresaAvaliacao;