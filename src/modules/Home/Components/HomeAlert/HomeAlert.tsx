import AlertaAtrasados from "@/shared/components/AlertAtrasados/AlertAtrasados";
import { useNavigate } from "react-router-dom";

export default function HomeAlert() {

    const navigate = useNavigate();

    function handleViewOverdue() {
        navigate("/follow");
    }

    return (
        <AlertaAtrasados
            onViewOverdue={handleViewOverdue}
        />
    );
}