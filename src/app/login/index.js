import React, { useCallback, useEffect } from "react";
import Layout from "../../components/layout";
import useTranslate from "../../hooks/use-translate";
import LayoutFlex from "../../components/layout-flex";
import LocaleSelect from "../../containers/locale-select";
import Tools from "../../containers/tools";
import LoginForm from "../../components/login-form";
import useStore from "../../hooks/use-store";
import useSelector from "../../hooks/use-selector";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const store = useStore();
  const error_message = useSelector((state) => state.auth.error_message);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) navigate("/profile", { replace: true });
  }, [token]);

  const { t } = useTranslate();

  const login = useCallback(async (user_login, password) => {
    await store.get("auth").login(user_login, password, () => {
      navigate("/", { replace: true });
    });
  });

  return (
    <Layout
      head={
        <LayoutFlex flex="between">
          <h1>{t("title")}</h1>
          <LocaleSelect />
        </LayoutFlex>
      }
    >
      <Tools />
      <LoginForm onSubmit={login} error_message={error_message} />
    </Layout>
  );
}

export default Login;
