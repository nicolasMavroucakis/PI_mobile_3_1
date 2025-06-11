import { View, Text, Image, ScrollView } from "react-native";
import EmpresaInfoScreenStyle from "@/app/Pages/PrincipalApp/EmpresaInfoScreen/EmpresaInfoScreenStyle";
import { calcularMediaEAvaliacoes } from "../utils/avaliacaoUtils";
import UserImg from "../../assets/images/user.jpeg"
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy, limit, getDoc, doc } from "firebase/firestore";
import StartFirebase from "@/app/crud/firebaseConfig";
import { useEmpresaContext } from "@/app/GlobalContext/EmpresaReservaGlobalContext";

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

const EmpresaAvaliacao = () => {
  const { db } = StartFirebase();
  const empresa = useEmpresaContext();
  const [avaliacoes, setAvaliacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Empresa ID do contexto:', empresa.id);
    const fetchAvaliacoes = async () => {
      if (!empresa.id) return;
      setLoading(true);
      const q = query(
        collection(db, "avaliacao"),
        where("empresaId", "==", empresa.id),
        limit(15)
      );
      console.log('Query Firestore:', q);
      const snap = await getDocs(q);
      const avaliacoesComUsuario = await Promise.all(snap.docs.map(async docSnap => {
        const data = docSnap.data();
        let nome = "Usuário";
        let fotoPerfil = null;
        if (data.clienteId) {
          try {
            const userRef = doc(db, "users", data.clienteId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const userData = userSnap.data();
              nome = userData.nome || nome;
              fotoPerfil = userData.fotoPerfil || null;
            }
          } catch (e) { /* ignore */ }
        }
        return { id: docSnap.id, ...data, nome, fotoPerfil };
      }));
      console.log('Avaliações encontradas:', avaliacoesComUsuario);
      setAvaliacoes(avaliacoesComUsuario);
      setLoading(false);
    };
    fetchAvaliacoes();
  }, [empresa.id]);

  const ratingsData: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let total = 0;
  let sum = 0;
  avaliacoes.forEach(av => {
    if (av.nota >= 1 && av.nota <= 5) {
      ratingsData[av.nota] = (ratingsData[av.nota] || 0) + 1;
      sum += av.nota;
      total++;
    }
  });
  const average = total > 0 ? (sum / total).toFixed(1) : "0.0";

  // Filtrar avaliações que têm comentário para exibição
  const avaliacoesComComentario = avaliacoes.filter(av => av.comentario && av.comentario.trim() !== '');

  return (
    <ScrollView style={{ flex: 1 }}>
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
            {loading ? (
              <Text style={{ color: 'white' }}>Carregando avaliações...</Text>
            ) : (
              avaliacoesComComentario.length === 0 ? (
                <Text style={{ color: 'white' }}>Nenhuma avaliação com comentário ainda.</Text>
              ) : (
                avaliacoesComComentario.map((av, idx) => (
                  <View key={av.id || idx} style={EmpresaInfoScreenStyle.containerAvalaicaoUser}>
                    <View style={EmpresaInfoScreenStyle.containerUserImageName}>
                      <View>
                        <Image source={av.fotoPerfil ? { uri: av.fotoPerfil } : UserImg} style={EmpresaInfoScreenStyle.userImg}/>
                      </View>
                      <View>
                        <Text style={[EmpresaInfoScreenStyle.textInformationUser, {color: 'white'}]}>
                          {av.nome}
                        </Text>
                        <Text style={[EmpresaInfoScreenStyle.textInformationUser, {color: 'rgba(255, 255, 255, 0.5)'}]}>
                          {av.data && av.data.toDate ? av.data.toDate().toLocaleDateString() : ''}
                        </Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                      {[1,2,3,4,5].map(n => (
                        <Text key={n} style={{ fontSize: 18, color: n <= av.nota ? '#FFD700' : '#ccc' }}>★</Text>
                      ))}
                    </View>
                    <View>
                      <Text style={EmpresaInfoScreenStyle.textDaAvalaicao}>
                        {av.comentario || 'Sem comentário.'}
                      </Text>
                    </View>
                    <View style={[EmpresaInfoScreenStyle.line, {marginTop: 20}]}/>
                  </View>
                ))
              )
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default EmpresaAvaliacao;