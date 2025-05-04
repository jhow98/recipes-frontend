<template>
    <div>
        <AppHeader />

        <div class="page-wrapper">
            <div class="detail-card">
                <h2>{{ recipe.name }}</h2>
                <p><strong>Tempo de preparo:</strong> {{ recipe.preparation_time_minutes }} min</p>
                <p><strong>Porções:</strong> {{ recipe.servings }}</p>
                <p><strong>Ingredientes:</strong></p>
                <ul>
                    <li v-for="ing in ingredientsList" :key="ing">{{ ing }}</li>
                </ul>
                <p><strong>Modo de preparo:</strong></p>
                <p class="method">{{ recipe.preparation_method }}</p>

                <div class="actions" v-if="isOwner">
                    <button @click="edit">
                        <Pencil size:16 /> Editar
                    </button>
                    <button @click="confirmDelete">
                        <Trash2 size:16 /> Excluir
                    </button>
                    <button @click="print">
                        <Printer size:16 /> Imprimir
                    </button>
                </div>
            </div>
        </div>

        <ConfirmDeleteModal v-if="showModal" @confirm="remove" @cancel="showModal = false" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue';
import api from '@/services/api';
import { useAuthStore } from '@/store/auth';
import { Pencil, Trash2, Printer } from 'lucide-vue-next';

interface Recipe {
    id: number;
    name: string;
    preparation_time_minutes: number;
    servings: number;
    preparation_method: string;
    ingredients: string;
    userId: number;
    categoryId: number;
}

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const recipe = ref<Recipe>({
    id: 0, name: '', preparation_time_minutes: 0, servings: 0,
    preparation_method: '', ingredients: '', userId: 0, categoryId: 0
});
const showModal = ref(false);

onMounted(async () => {
    const id = Number(route.params.id);
    const res = await api.get<Recipe>(`/recipes/${id}`);
    recipe.value = res.data;
});

const ingredientsList = computed(() =>
    recipe.value.ingredients.split(',').map(s => s.trim())
);


const isOwner = computed(() => {
    console.log(recipe.value.userId, 'recipe.value.userId')
    console.log(auth.userId, 'auth.userId')
    return recipe.value.userId === auth.userId;
});

function edit() {
    router.push(`/receitas/${recipe.value.id}/editar`);
}
function confirmDelete() {
    showModal.value = true;
}
async function remove() {
    await api.delete(`/recipes/${recipe.value.id}`);
    router.push('/receitas');
}
function print() {
    api.get(`/recipes/${recipe.value.id}/print`, { responseType: 'blob' })
        .then(r => {
            const blob = new Blob([r.data], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `receita-${recipe.value.name}.pdf`;
            link.click();
        });
}
</script>

<style scoped>
.page-wrapper {
    padding: 2rem;
    display: flex;
    justify-content: center;
}

.detail-card {
    background: #fff;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    width: 100%;
}

.detail-card h2 {
    margin-bottom: 1rem;
}

.detail-card ul {
    list-style: disc;
    margin-left: 1.5rem;
}

.detail-card .method {
    white-space: pre-wrap;
    margin-top: 1rem;
}

.actions {
    margin-top: 1.5rem;
}

.actions button {
    margin-right: 0.5rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.actions button:hover {
    opacity: 0.9;
}

.actions button:nth-child(1) {
    background: #f0ad4e;
    color: #fff;
}

.actions button:nth-child(2) {
    background: #d9534f;
    color: #fff;
}

.actions button:nth-child(3) {
    background: #5bc0de;
    color: #fff;
}
</style>